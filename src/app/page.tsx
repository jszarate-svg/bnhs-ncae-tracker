'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Users, Search, Shield, UserCheck, Edit3, 
  RefreshCw, Wifi, WifiOff,
  ArrowRight, LogOut, Ban, Calendar, Hash, Sun, Moon, Sunrise,
  BarChart3, Download, User, Laptop, Lock, X, Check, Grid
} from 'lucide-react';

interface Student {
  id: string;
  lrn: string;
  name: string;
  section: 'Thorndike' | 'Gardner' | 'Dewey';
  gender: 'M' | 'F';
  session: string;
  status: 'Not Started' | 'In Exam' | 'Completed' | 'Absent' | 'Forgot to Sign' | 'Ineligible' | 'Custom';
  signedAttendance: boolean;
  customStatus?: string;
  isEligible: boolean;
  assignedSeat?: number; // 1 to 15
}

const DEFAULT_PROCTOR_PIN = '2026';

const RAW_STUDENTS_DATA: Array<Omit<Student, 'session'>> = [
  // 10 - THORNDIKE (34 Total, 33 Eligible)
  { id: 'th-1', lrn: '117792150055', name: 'ALISNA, JULIET, CALAPUAN', section: 'Thorndike', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-2', lrn: '117792160061', name: 'ARIOSTE, SHAJARA, CABURNAY', section: 'Thorndike', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-3', lrn: '117792160043', name: 'BARCOMA, JASCENT CLEAR, ISOGAN', section: 'Thorndike', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-4', lrn: '117797160026', name: 'BAYOG-ANG, JAY MARK, SARNO', section: 'Thorndike', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-5', lrn: '117792160029', name: 'BOLIBOLI, JOVESEIL, OLBEDENCIA', section: 'Thorndike', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-6', lrn: '117792160078', name: 'BRADY, JAMAICA, -', section: 'Thorndike', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-7', lrn: '117797160002', name: 'CANONOY, ROGELIO JR, ANDRAQUE', section: 'Thorndike', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-8', lrn: '117792160045', name: 'DAYONDON, JIMESRYL, PILAPIL', section: 'Thorndike', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-9', lrn: '117797140029', name: 'DEL ROSARIO, VIRGILLIO JR, MAG-ASO', section: 'Thorndike', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-10', lrn: '117797160024', name: 'DELUBIO, SHERLYN, DELIMA', section: 'Thorndike', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-11', lrn: '117796140020', name: 'ESPLAGUERA, JENNYL, VERBO', section: 'Thorndike', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-12', lrn: '116093160022', name: 'GABIA, CHRISSAN, ARBOLEDA', section: 'Thorndike', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-13', lrn: '117792150055', name: 'GALLARDO, MARIAN, RAFAEL', section: 'Thorndike', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-14', lrn: '117792160012', name: 'GALLARDO, NELBELENE, ASEGURADO', section: 'Thorndike', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-15', lrn: '117792160033', name: 'GONZAGA, JOSH ANDREE, TAPDASAN', section: 'Thorndike', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-16', lrn: '117792160034', name: 'HILIGAN, JHON PAOLO, JUANITO', section: 'Thorndike', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-17', lrn: '117797160005', name: 'JERANDOY, JOVENOEL, DENEROS', section: 'Thorndike', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-18', lrn: '117792160067', name: 'LARIOSA, RINELEN, BARANGGAN', section: 'Thorndike', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-19', lrn: '117792160082', name: 'LEMORAN, JHOVY MAR, EWICAN', section: 'Thorndike', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-20', lrn: '117792160023', name: 'MAHUSAY, JAMES, PASI', section: 'Thorndike', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-21', lrn: '117792150073', name: 'MANDALONES, AYENA, - (NLS)', section: 'Thorndike', gender: 'F', status: 'Ineligible', customStatus: 'Non-Learner / Ineligible', signedAttendance: false, isEligible: false },
  { id: 'th-22', lrn: '117792160069', name: 'MELLAS, ZYRIEL ANN, COGONON', section: 'Thorndike', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-23', lrn: '117797160016', name: 'NAVAJA, ANGELICA, PACALDO', section: 'Thorndike', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-24', lrn: '117792160014', name: 'NAVARRO, JELYN MAE, MAQUISA', section: 'Thorndike', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-25', lrn: '117792160015', name: 'NAVARRO, JOVEMAR, JR DESTACAMENTO', section: 'Thorndike', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-26', lrn: '117792160085', name: 'ORDONIO, RICHMER, CABALLERO', section: 'Thorndike', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-27', lrn: '117792160053', name: 'PILAPIL, JECKNEY, MOSQUIDA', section: 'Thorndike', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-28', lrn: '117792160054', name: 'PILAPIL, LEONARD, PASULOT', section: 'Thorndike', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-29', lrn: '117792160071', name: 'SABERON, JAHAZIEL, JUANILLO', section: 'Thorndike', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-30', lrn: '117797150018', name: 'SARNO, ROVEC, OLIVERIO', section: 'Thorndike', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-31', lrn: '126529140010', name: 'VILLAHERMOSA, JOMAR, CARUSCAY', section: 'Thorndike', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-32', lrn: '128387160003', name: 'VILLAJOS, LEA MAE, CABALLERO', section: 'Thorndike', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-33', lrn: '117792160040', name: 'VILLAREAL, JONA GRACE, GEQUE', section: 'Thorndike', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-34', lrn: '117796170021', name: 'VILLARMENTE, JOE, TANQUE', section: 'Thorndike', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },

  // 10 - GARDNER (29 Total, All Eligible)
  { id: 'ga-1', lrn: '117792160003', name: 'BALOSA, MARK JHON L.', section: 'Gardner', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-2', lrn: '117792160056', name: 'BARING, RUSSEL E.', section: 'Gardner', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-3', lrn: '117792160030', name: 'CABULONG, EJAY O.', section: 'Gardner', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-4', lrn: '116909160007', name: 'ALDE, QUEENCIEVELLE R.', section: 'Gardner', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-5', lrn: '117798160010', name: 'ALESNA, JUDY ANN O.', section: 'Gardner', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-6', lrn: '117792160005', name: 'BRADE, JESSA MAE D.', section: 'Gardner', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-7', lrn: '117792160082', name: 'BARCOMA, REYBEN', section: 'Gardner', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-8', lrn: '117792170098', name: 'DOLOR, COBBY BRYAN C.', section: 'Gardner', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-9', lrn: '117792160022', name: 'DOMINGGO, PAOLO E.', section: 'Gardner', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-10', lrn: '117792160048', name: 'GONZAGA, JOSH LYCER', section: 'Gardner', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-11', lrn: '117796160011', name: 'GORDO, FRANCIS C.', section: 'Gardner', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-12', lrn: '116908160003', name: 'HULLEZA, EDRIAN S.', section: 'Gardner', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-13', lrn: '117792160036', name: 'LEMORAN, JOCELLE MARL E.', section: 'Gardner', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-14', lrn: '117792170099', name: 'LASCONIA, RODEL D.', section: 'Gardner', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-15', lrn: '117798170026', name: 'LINGANAY, GINO D.', section: 'Gardner', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-16', lrn: '117796160013', name: 'RUBIO, JOHN ANDREW R.', section: 'Gardner', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-17', lrn: '117792160059', name: 'SABERON, JAPET R.', section: 'Gardner', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-18', lrn: '117797160007', name: 'TELEBRICO, KEVEN I.', section: 'Gardner', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-19', lrn: '117797160008', name: 'VELASCO, KIM ASHLEY D.', section: 'Gardner', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-20', lrn: '117796160007', name: 'CALAPUAN, AILEEN L.', section: 'Gardner', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-21', lrn: '117792160011', name: 'ENGGANA, JESSAMAE B.', section: 'Gardner', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-22', lrn: '117326150039', name: 'ENGGANA, WELMIROSE A.', section: 'Gardner', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-23', lrn: '116909160030', name: 'ESCOSAR, JELLY', section: 'Gardner', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-24', lrn: '116908160010', name: 'GABIA, MARIA CRISTY L.', section: 'Gardner', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-25', lrn: '117792170112', name: 'GERALDEZ, CRISTEPHIN JOY C.', section: 'Gardner', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-26', lrn: '117792160035', name: 'JUANITO, MARY ANN H.', section: 'Gardner', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-27', lrn: '117792150072', name: 'MAGBANUA, PRINCESS MABEY P.', section: 'Gardner', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-28', lrn: '117792160070', name: 'PARAN, JERAMAE A.', section: 'Gardner', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-29', lrn: '117792160018', name: 'SUMANTING, ZYAN BELLE D.', section: 'Gardner', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },

  // 10 - DEWEY (29 Total, All Eligible)
  { id: 'de-1', lrn: '107921150317', name: 'ABUEME, MA. ANGELICA, PILAPIL', section: 'Dewey', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-2', lrn: '116909160013', name: 'ALBIAR, DENNISE JEAN, PURISIMA', section: 'Dewey', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-3', lrn: '117797170034', name: 'ALESNA, ANGEL, CAMPANIA', section: 'Dewey', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-4', lrn: '117792160002', name: 'ALIGATO, JANELLE, RIVERA', section: 'Dewey', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-5', lrn: '117792160027', name: 'ALORA, CRISTEL, SATINGASIN', section: 'Dewey', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-6', lrn: '117792160055', name: 'ARELLANO, JESSICA, PACALDO', section: 'Dewey', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-7', lrn: '117792160062', name: 'BARBADILLO, CHERE, BAROY', section: 'Dewey', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-8', lrn: '117792160008', name: 'CONTENIDO, KYL PATRICK, CEJAS', section: 'Dewey', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-9', lrn: '117792160032', name: 'CUIZON, GIAN KLENT, -', section: 'Dewey', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-10', lrn: '117797160006', name: 'JUANILLO, JHON ROEY, CABALLERO', section: 'Dewey', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-11', lrn: '117792160052', name: 'PESODAS, MARK ANTHONY, ARELLANO', section: 'Dewey', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-12', lrn: '120755160018', name: 'RIM, DAVRYL JAMES, LESONDRA', section: 'Dewey', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-13', lrn: '117796160012', name: 'TAPIC, JHONREY, ESCOREL', section: 'Dewey', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-14', lrn: '117797160023', name: 'VILLANUEVA, DHEAN JR, CARAMIHAN', section: 'Dewey', gender: 'M', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-15', lrn: '117792160007', name: 'CALOG, MELCHIE, JUANILLO', section: 'Dewey', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-16', lrn: '117797170044', name: 'CARAMIHAN, PRECIEL JANE, DAYOHA', section: 'Dewey', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-17', lrn: '117792160031', name: 'COMPACION, PATRICE MAXXIMA, JUMAGDAO', section: 'Dewey', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-18', lrn: '117792150059', name: 'GERANDOY, KHEM, PILAPIL', section: 'Dewey', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-19', lrn: '117792160013', name: 'HERNAN, BEA MAY, YANQUIN', section: 'Dewey', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-20', lrn: '117797160017', name: 'INSIK, STELLA MARRIEZ, REMUNDA', section: 'Dewey', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-21', lrn: '116904160038', name: 'LESONDRA, MENIROSE, ALLERA', section: 'Dewey', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-22', lrn: '117792170120', name: 'LOSARITA, LAICA, LARITA', section: 'Dewey', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-23', lrn: '117797160013', name: 'MIRANDA, GEREMEH, FABELLAR', section: 'Dewey', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-24', lrn: '116904170054', name: 'PAZ, CRISTAL MAE, ESOLA', section: 'Dewey', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-25', lrn: '117797160014', name: 'PELESORES, DANICA, VILLARDE', section: 'Dewey', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-26', lrn: '117792160017', name: 'RICABORDA, PRENCISS DEVINE, APURADO', section: 'Dewey', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-27', lrn: '117798140083', name: 'ROSIANA, ANALIZA, DESTACAMENTO', section: 'Dewey', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-28', lrn: '117341160013', name: 'RUIZ, KIM, LUMANGYAO', section: 'Dewey', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-29', lrn: '117796170001', name: 'SOHOT, ROSEMARIE, TANIA', section: 'Dewey', gender: 'F', status: 'Not Started', signedAttendance: false, isEligible: true },
];

const buildInitialStudents = (): Student[] => {
  let eligibleCounter = 0;
  return RAW_STUDENTS_DATA.map(st => {
    if (!st.isEligible) {
      return { ...st, session: 'Non-Pullout' };
    }

    let sessionName = 'Day 1 - Session 1';
    let seatInSession = (eligibleCounter % 15) + 1;

    if (eligibleCounter < 15) sessionName = 'Day 1 - Session 1';
    else if (eligibleCounter < 30) sessionName = 'Day 1 - Session 2';
    else if (eligibleCounter < 45) sessionName = 'Day 2 - Session 1';
    else if (eligibleCounter < 60) sessionName = 'Day 2 - Session 2';
    else if (eligibleCounter < 75) sessionName = 'Day 3 - Session 1';
    else sessionName = 'Day 3 - Session 2';

    eligibleCounter++;
    return { ...st, session: sessionName, assignedSeat: seatInSession };
  });
};

export default function NCAETracker() {
  const [role, setRole] = useState<'proctor' | 'adviser' | null>(null);
  const [pinInput, setPinInput] = useState<string>('');
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [pinError, setPinError] = useState<boolean>(false);

  const [students, setStudents] = useState<Student[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [selectedSession, setSelectedSession] = useState<string>('Day 1 - Session 1');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [showMetrics, setShowMetrics] = useState<boolean>(true);
  const [showSeatingMap, setShowSeatingMap] = useState<boolean>(true);

  const [selectedSeatModal, setSelectedSeatModal] = useState<number | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    if (!currentTime) return { text: 'Good day!', icon: <Sun className="w-4 h-4 text-amber-500" /> };
    const hour = currentTime.getHours();
    if (hour < 12) {
      return { text: 'Good morning!', icon: <Sunrise className="w-4 h-4 text-amber-500" /> };
    } else if (hour < 18) {
      return { text: 'Good afternoon!', icon: <Sun className="w-4 h-4 text-amber-500" /> };
    } else {
      return { text: 'Good evening!', icon: <Moon className="w-4 h-4 text-indigo-500" /> };
    }
  };

  const syncDatabase = async () => {
    const { data, error } = await supabase.from('students').select('*');
    if (error) {
      console.error('Error fetching students:', error);
      setIsConnected(false);
      return;
    }

    setIsConnected(true);
    const initialList = buildInitialStudents();

    if (!data || data.length === 0 || data.length < 80) {
      await supabase.from('students').delete().neq('id', '0');
      await supabase.from('students').insert(initialList);
      setStudents(initialList);
    } else {
      setStudents(data as Student[]);
    }
  };

  useEffect(() => {
    syncDatabase();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'students' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            const updatedStudent = payload.new as Student;
            setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
          } else {
            syncDatabase();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleProctorAccess = () => {
    if (pinInput === DEFAULT_PROCTOR_PIN) {
      setRole('proctor');
      setShowPinModal(false);
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleStatusChange = async (id: string, newStatus: Student['status']) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    await supabase.from('students').update({ status: newStatus }).eq('id', id);
  };

  const handleSessionDirectChange = async (id: string, newSession: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, session: newSession } : s));
    await supabase.from('students').update({ session: newSession }).eq('id', id);
  };

  const handleAttendanceChange = async (id: string, signed: boolean) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, signedAttendance: signed } : s));
    await supabase.from('students').update({ signedAttendance: signed }).eq('id', id);
  };

  const handleAssignSeat = async (seatNumber: number, studentId: string | null) => {
    if (studentId) {
      setStudents(prev => prev.map(s => {
        if (s.session === selectedSession && s.assignedSeat === seatNumber) {
          return { ...s, assignedSeat: undefined };
        }
        if (s.id === studentId) {
          return { ...s, assignedSeat: seatNumber };
        }
        return s;
      }));

      await supabase.from('students').update({ assignedSeat: null }).eq('session', selectedSession).eq('assignedSeat', seatNumber);
      await supabase.from('students').update({ assignedSeat: seatNumber }).eq('id', studentId);
    } else {
      setStudents(prev => prev.map(s => s.session === selectedSession && s.assignedSeat === seatNumber ? { ...s, assignedSeat: undefined } : s));
      await supabase.from('students').update({ assignedSeat: null }).eq('session', selectedSession).eq('assignedSeat', seatNumber);
    }
    setSelectedSeatModal(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    setStudents(prev => prev.map(s => s.id === editingStudent.id ? editingStudent : s));

    await supabase.from('students').update({
      name: editingStudent.name.trim(),
      lrn: editingStudent.lrn.trim(),
      session: editingStudent.session.trim() || 'Day 1 - Session 1',
      status: editingStudent.status,
      signedAttendance: editingStudent.signedAttendance,
      customStatus: editingStudent.customStatus || ''
    }).eq('id', editingStudent.id);

    setEditingStudent(null);
  };

  const handleForceReset = async () => {
    const initialList = buildInitialStudents();
    setStudents(initialList);
    await supabase.from('students').delete().neq('id', '0');
    await supabase.from('students').insert(initialList);
  };

  const exportCSV = () => {
    const headers = ['LRN', 'Name', 'Section', 'Gender', 'Session', 'Seat/Laptop #', 'Status', 'Form 4 Signed'];
    const rows = filteredStudents.map(s => [
      `"${s.lrn}"`,
      `"${s.name}"`,
      `"${s.section}"`,
      `"${s.gender}"`,
      `"${s.session}"`,
      s.assignedSeat ? `"Laptop #${s.assignedSeat}"` : '"Unassigned"',
      `"${s.status}"`,
      s.signedAttendance ? 'Signed' : 'Unsigned'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NCAE_15Laptops_Pullout_${selectedSection}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const uniqueSessions = Array.from(new Set(students.map(s => s.session))).filter(Boolean).sort();

  const sessionStudents = students.filter(s => selectedSession === 'All' || s.session === selectedSession);

  const filteredStudents = students.filter(s => {
    const matchesSection = selectedSection === 'All' || s.section === selectedSection;
    const matchesSession = selectedSession === 'All' || s.session === selectedSession;
    
    let matchesStatus = true;
    if (selectedStatus === 'Forgot to Sign') {
      matchesStatus = s.status === 'Forgot to Sign' || (!s.signedAttendance && s.status === 'Completed');
    } else if (selectedStatus === 'Ineligible') {
      matchesStatus = !s.isEligible || s.status === 'Ineligible';
    } else if (selectedStatus !== 'All') {
      matchesStatus = s.status === selectedStatus;
    }

    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.lrn.includes(searchQuery);
    return matchesSection && matchesSession && matchesStatus && matchesSearch;
  });

  const totalCount = students.length;
  const completed = students.filter(s => s.status === 'Completed').length;
  const inExam = students.filter(s => s.status === 'In Exam').length;
  const absent = students.filter(s => s.status === 'Absent').length;
  const forgotSign = students.filter(s => s.status === 'Forgot to Sign' || (!s.signedAttendance && s.status === 'Completed')).length;
  const ineligibleCount = students.filter(s => !s.isEligible).length;

  const thorndikeCount = students.filter(s => s.section === 'Thorndike').length;
  const gardnerCount = students.filter(s => s.section === 'Gardner').length;
  const deweyCount = students.filter(s => s.section === 'Dewey').length;

  const thorndikeCompleted = students.filter(s => s.section === 'Thorndike' && s.status === 'Completed').length;
  const gardnerCompleted = students.filter(s => s.section === 'Gardner' && s.status === 'Completed').length;
  const deweyCompleted = students.filter(s => s.section === 'Dewey' && s.status === 'Completed').length;

  const greeting = getGreeting();

  const glassContainerStyle = "bg-white/20 backdrop-blur-3xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-3xl relative overflow-hidden";
  const glassCardStyle = "bg-white/30 backdrop-blur-3xl border border-white/70 shadow-[0_8px_32px_0_rgba(31,38,135,0.12)] rounded-3xl relative overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.25)] hover:border-white/90 hover:bg-white/40";

  const rowsConfig = [
    { rowNum: 1, seats: [1, 2, 3, 4] },
    { rowNum: 2, seats: [5, 6, 7, 8] },
    { rowNum: 3, seats: [9, 10, 11, 12] },
    { rowNum: 4, seats: [13, 14, 15] },
  ];

  if (!role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-300/40 via-sky-200/50 via-purple-200/40 to-blue-300/50 text-slate-800 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="absolute top-10 left-10 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-to-tr from-blue-400/40 to-indigo-500/30 rounded-full blur-[80px] sm:blur-[100px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-to-br from-purple-400/40 to-pink-400/30 rounded-full blur-[80px] sm:blur-[100px] animate-pulse pointer-events-none" />

        <div className="max-w-xl w-full text-center space-y-6 sm:space-y-8 relative z-10 px-2">
          <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 bg-white/30 backdrop-blur-3xl border border-white/80 rounded-full shadow-sm">
            {greeting.icon}
            <span className="text-xs font-black tracking-wide text-slate-900">
              {greeting.text}
            </span>
            {currentTime && (
              <span className="text-[11px] font-mono text-slate-600 border-l border-white/60 pl-2 ml-1">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-blue-700/90 drop-shadow-sm">
              Bagonbon National High School
            </h2>
            <h1 className="text-3xl sm:text-6xl font-black text-slate-900 tracking-tight drop-shadow-sm">
              NCAE 2026 Portal
            </h1>
            <p className="text-slate-700 text-xs sm:text-base max-w-md mx-auto font-medium leading-relaxed">
              Real-Time Examination Pull-Out & Directory Portal
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 text-left pt-2">
            <button
              onClick={() => setShowPinModal(true)}
              className={`${glassCardStyle} p-5 sm:p-6 flex flex-col justify-between space-y-4 sm:space-y-6 group border-2 border-blue-400/40 active:scale-95 transition-transform`}
            >
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 bg-blue-500/20 text-blue-800 rounded-2xl w-fit border border-white/80 shadow-inner flex items-center gap-2">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                  <Lock className="w-4 h-4 text-blue-700" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                  Proctor Mode (PIN Locked)
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  PIN-protected mode to manage schedules, mark attendance, and assign laptop seating.
                </p>
              </div>
              <div className="flex items-center text-xs font-black text-blue-700">
                Unlock Proctor Portal <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </button>

            <button
              onClick={() => setRole('adviser')}
              className={`${glassCardStyle} p-5 sm:p-6 flex flex-col justify-between space-y-4 sm:space-y-6 group border-2 border-emerald-400/40 active:scale-95 transition-transform`}
            >
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 bg-emerald-500/20 text-emerald-800 rounded-2xl w-fit border border-white/80 shadow-inner">
                  <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Advisers / Students Mode
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Public directory view. Filter by Section (Thorndike, Gardner, Dewey) to find your schedule.
                </p>
              </div>
              <div className="flex items-center text-xs font-black text-emerald-700">
                Enter Directory <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </button>
          </div>

          <div className="pt-4 border-t border-white/50 flex items-center justify-center gap-2 text-xs font-bold text-slate-600">
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
            {isConnected ? 'Connected to Supabase Realtime' : 'Connecting to Database...'}
          </div>

          <div className="text-[10px] sm:text-[11px] font-black text-slate-500/80 tracking-widest uppercase">
            JUDIMER ZARATE — BAGONBON NHS NCAE 2026 PORTAL
          </div>
        </div>

        {showPinModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xl flex items-center justify-center p-4 z-50">
            <div className="bg-white/30 backdrop-blur-3xl border border-white/80 rounded-3xl max-w-sm w-full p-6 shadow-[0_24px_48px_0_rgba(0,0,0,0.3)] space-y-5 text-center">
              <div className="p-3.5 bg-blue-500/20 text-blue-900 rounded-full w-fit mx-auto border border-white">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Enter Proctor PIN</h3>
                <p className="text-xs text-slate-700 font-bold mt-1">Authorized proctor access only</p>
              </div>

              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={e => { setPinInput(e.target.value); setPinError(false); }}
                onKeyDown={e => e.key === 'Enter' && handleProctorAccess()}
                placeholder="Enter PIN..."
                className="w-full text-center text-xl sm:text-2xl tracking-[0.4em] font-mono bg-white/70 border border-white rounded-2xl py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner text-slate-900 font-bold"
                autoFocus
              />

              {pinError && (
                <p className="text-xs font-black text-rose-700 bg-rose-100/80 p-2 rounded-xl border border-rose-200">
                  Incorrect PIN!
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => { setShowPinModal(false); setPinInput(''); setPinError(false); }}
                  className="flex-1 py-2.5 bg-white/50 hover:bg-white/80 text-slate-800 rounded-2xl text-xs font-black transition border border-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProctorAccess}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-500/30 border border-blue-400/50 transition"
                >
                  Verify PIN
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200/50 via-sky-100/60 via-purple-100/40 to-blue-200/50 text-slate-800 font-sans p-2.5 sm:p-6 lg:p-8 relative flex flex-col justify-between overflow-x-hidden">
      
      <div className="fixed top-0 left-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-gradient-to-tr from-blue-300/30 to-indigo-400/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 space-y-4 sm:space-y-6">
        <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/60 pb-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white/30 backdrop-blur-3xl px-3 py-1 rounded-full border border-white/80 text-xs font-extrabold text-slate-900">
                {greeting.icon}
                {greeting.text}
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-black backdrop-blur-3xl ${isConnected ? 'bg-emerald-500/20 text-emerald-900 border border-white/80' : 'bg-rose-500/20 text-rose-900 border border-white/80'}`}>
                {isConnected ? <><Wifi className="w-3 h-3 text-emerald-700" /> Live Sync</> : <><WifiOff className="w-3 h-3 text-rose-700" /> Connecting...</>}
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900 drop-shadow-sm pt-1">
              Bagonbon NHS — NCAE 2026 Portal
            </h1>
            <p className="text-slate-600 text-xs font-bold flex items-center gap-1">
              <Laptop className="w-3.5 h-3.5 text-blue-700" /> 15 Laptops Cap • Session Directory
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
            {role === 'proctor' && (
              <button
                onClick={() => setShowSeatingMap(!showSeatingMap)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 border border-white/80 rounded-2xl text-xs font-black transition ${showSeatingMap ? 'bg-indigo-600 text-white' : 'bg-white/30 text-slate-800'}`}
              >
                <Grid className="w-3.5 h-3.5" />
                {showSeatingMap ? 'Hide Map' : 'Seating Map'}
              </button>
            )}

            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white/30 hover:bg-white/50 border border-white/80 rounded-2xl text-xs font-black text-slate-800 transition"
            >
              <BarChart3 className="w-3.5 h-3.5 text-blue-700" />
              {showMetrics ? 'Hide Analytics' : 'Analytics'}
            </button>

            {role === 'proctor' && (
              <button
                onClick={exportCSV}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-2xl text-xs font-black shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
            )}

            <div className="flex items-center bg-white/30 backdrop-blur-3xl border border-white/80 p-1 rounded-2xl w-full sm:w-auto justify-between sm:justify-start">
              <span className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black ${
                role === 'proctor' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {role === 'proctor' ? <Shield className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                {role === 'proctor' ? 'Proctor' : 'Advisers/Students'}
              </span>
              <button
                onClick={() => setRole(null)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-slate-700 hover:text-slate-900 text-xs font-bold"
              >
                <LogOut className="w-3.5 h-3.5" /> Exit
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">

          {/* HORIZONTAL SCROLLABLE SECTION TABS FOR PHONES */}
          <div className="bg-white/20 backdrop-blur-3xl border border-white/70 p-1.5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              {['All', 'Thorndike', 'Gardner', 'Dewey'].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSection(sec)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap flex-shrink-0 ${
                    selectedSection === sec
                      ? 'bg-white/90 text-blue-700 shadow-sm border border-white'
                      : 'text-slate-700 hover:bg-white/30'
                  }`}
                >
                  {sec === 'All' ? 'All Sections' : `Section ${sec}`}
                </button>
              ))}
            </div>
          </div>

          {/* INTERACTIVE SEATING MAP — EXCLUSIVELY FOR PROCTOR MODE */}
          {role === 'proctor' && showSeatingMap && (
            <div className={`${glassContainerStyle} p-3.5 sm:p-6 space-y-3 sm:space-y-4 border-2 border-indigo-300/60 shadow-xl`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/60 pb-3">
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Laptop className="w-4 h-4 text-indigo-700" />
                    Proctor Laptop Seating Map (1-4 | 5-8 | 9-12 | 13-15)
                  </h3>
                  <p className="text-[11px] text-slate-700 font-medium">
                    Session: <span className="font-black text-indigo-900">{selectedSession}</span>
                  </p>
                </div>

                <select
                  value={selectedSession}
                  onChange={e => setSelectedSession(e.target.value)}
                  className="w-full sm:w-auto bg-white/80 border border-white rounded-xl px-3 py-1.5 text-xs text-slate-900 font-black shadow-inner"
                >
                  {uniqueSessions.map(session => (
                    <option key={session} value={session}>{session}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 pt-1">
                {rowsConfig.map(row => (
                  <div key={row.rowNum} className="bg-white/30 backdrop-blur-2xl border border-white/80 rounded-2xl p-2.5 shadow-sm space-y-2">
                    <div className="flex items-center justify-between border-b border-white/50 pb-1">
                      <span className="text-[10px] sm:text-[11px] font-black uppercase text-indigo-950 tracking-wider">
                        Row {row.rowNum} (Seats {row.seats[0]}-{row.seats[row.seats.length - 1]})
                      </span>
                      <span className="text-[9px] font-bold text-slate-600 bg-white/60 px-2 py-0.5 rounded-full border border-white">
                        {row.seats.length} Laptops
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {row.seats.map(seatNum => {
                        const assignedStudent = sessionStudents.find(s => s.assignedSeat === seatNum);

                        return (
                          <button
                            key={seatNum}
                            onClick={() => setSelectedSeatModal(seatNum)}
                            className={`p-2 rounded-xl text-left border transition-all flex flex-col justify-between h-20 sm:h-28 relative ${
                              assignedStudent
                                ? assignedStudent.status === 'Completed'
                                  ? 'bg-emerald-500/25 border-emerald-400 text-emerald-950 shadow-sm'
                                  : assignedStudent.status === 'In Exam'
                                  ? 'bg-amber-500/25 border-amber-400 text-amber-950 shadow-sm'
                                  : 'bg-blue-500/25 border-blue-400 text-blue-950 shadow-sm'
                                : 'bg-white/60 border-white/80 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-[9px] sm:text-[10px] font-black uppercase text-indigo-900">
                                Laptop #{seatNum}
                              </span>
                              {assignedStudent ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                              ) : (
                                <Laptop className="w-3 h-3 text-indigo-600" />
                              )}
                            </div>

                            <div>
                              {assignedStudent ? (
                                <div>
                                  <p className="text-[11px] sm:text-xs font-black leading-tight line-clamp-1 text-slate-900">
                                    {assignedStudent.name}
                                  </p>
                                  <p className="text-[9px] font-bold text-slate-600">
                                    {assignedStudent.section}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-[10px] font-bold text-slate-400 italic">
                                  Assign
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STATS COUNTERS CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5 sm:gap-4">
            <button
              onClick={() => setSelectedStatus('All')}
              className={`${glassCardStyle} p-3 text-left ${selectedStatus === 'All' ? 'border-blue-500 ring-2 ring-blue-500/20 bg-white/50' : ''}`}
            >
              <p className="text-slate-600 text-[9px] sm:text-xs font-black uppercase">Total Students</p>
              <p className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5">{totalCount}</p>
            </button>

            <button
              onClick={() => setSelectedStatus('In Exam')}
              className={`${glassCardStyle} p-3 text-left ${selectedStatus === 'In Exam' ? 'border-amber-500 ring-2 ring-amber-500/20 bg-white/50' : ''}`}
            >
              <p className="text-amber-700 text-[9px] sm:text-xs font-black uppercase">In Exam</p>
              <p className="text-lg sm:text-2xl font-black text-amber-600 mt-0.5">{inExam}</p>
            </button>

            <button
              onClick={() => setSelectedStatus('Completed')}
              className={`${glassCardStyle} p-3 text-left ${selectedStatus === 'Completed' ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-white/50' : ''}`}
            >
              <p className="text-emerald-700 text-[9px] sm:text-xs font-black uppercase">Completed</p>
              <p className="text-lg sm:text-2xl font-black text-emerald-600 mt-0.5">{completed}</p>
            </button>

            <button
              onClick={() => setSelectedStatus('Absent')}
              className={`${glassCardStyle} p-3 text-left ${selectedStatus === 'Absent' ? 'border-rose-500 ring-2 ring-rose-500/20 bg-white/50' : ''}`}
            >
              <p className="text-rose-700 text-[9px] sm:text-xs font-black uppercase">Absent / Error</p>
              <p className="text-lg sm:text-2xl font-black text-rose-600 mt-0.5">{absent}</p>
            </button>

            <button
              onClick={() => setSelectedStatus('Forgot to Sign')}
              className={`${glassCardStyle} p-3 text-left ${selectedStatus === 'Forgot to Sign' ? 'border-purple-500 ring-2 ring-purple-500/20 bg-white/50' : ''}`}
            >
              <p className="text-purple-700 text-[9px] sm:text-xs font-black uppercase">Unsigned Form 4</p>
              <p className="text-lg sm:text-2xl font-black text-purple-600 mt-0.5">{forgotSign}</p>
            </button>

            <button
              onClick={() => setSelectedStatus('Ineligible')}
              className={`${glassCardStyle} p-3 text-left col-span-2 md:col-span-1 ${selectedStatus === 'Ineligible' ? 'border-slate-500 ring-2 ring-slate-500/20 bg-white/50' : ''}`}
            >
              <p className="text-slate-600 text-[9px] sm:text-xs font-black uppercase">Ineligible (NLS)</p>
              <p className="text-lg sm:text-2xl font-black text-slate-500 mt-0.5">{ineligibleCount}</p>
            </button>
          </div>

          {showMetrics && (
            <div className={`${glassContainerStyle} p-3.5 sm:p-5 space-y-3`}>
              <div className="flex items-center justify-between border-b border-white/60 pb-2">
                <h3 className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-700" /> Per-Section Exam Completion Progress
                </h3>
                <span className="text-[10px] font-mono text-emerald-700 font-black">Live Sync</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <div className="flex justify-between text-xs font-black mb-1">
                    <span className="text-slate-800">Thorndike ({thorndikeCompleted}/{thorndikeCount})</span>
                    <span className="text-blue-700">{Math.round((thorndikeCompleted / thorndikeCount) * 100)}%</span>
                  </div>
                  <div className="w-full bg-white/40 border border-white/60 rounded-full h-3 overflow-hidden p-0.5">
                    <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(thorndikeCompleted / thorndikeCount) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-black mb-1">
                    <span className="text-slate-800">Gardner ({gardnerCompleted}/{gardnerCount})</span>
                    <span className="text-emerald-700">{Math.round((gardnerCompleted / gardnerCount) * 100)}%</span>
                  </div>
                  <div className="w-full bg-white/40 border border-white/60 rounded-full h-3 overflow-hidden p-0.5">
                    <div className="bg-emerald-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(gardnerCompleted / gardnerCount) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-black mb-1">
                    <span className="text-slate-800">Dewey ({deweyCompleted}/{deweyCount})</span>
                    <span className="text-purple-700">{Math.round((deweyCompleted / deweyCount) * 100)}%</span>
                  </div>
                  <div className="w-full bg-white/40 border border-white/60 rounded-full h-3 overflow-hidden p-0.5">
                    <div className="bg-purple-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(deweyCompleted / deweyCount) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEARCH & FILTERS BAR */}
          <div className={`${glassContainerStyle} p-3 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between`}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search student name or LRN..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white/50 border border-white/80 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 shadow-inner font-bold"
                />
              </div>

              <select
                value={selectedSession}
                onChange={e => setSelectedSession(e.target.value)}
                className="bg-white/50 border border-white/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none font-black"
              >
                <option value="All">All Sessions (Day 1 - Day 3)</option>
                {uniqueSessions.map(session => (
                  <option key={session} value={session}>{session}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="bg-white/50 border border-white/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none font-black"
              >
                <option value="All">All Statuses</option>
                <option value="Not Started">Not Started</option>
                <option value="In Exam">In Exam</option>
                <option value="Completed">Completed</option>
                <option value="Absent">Absent / Error</option>
                <option value="Forgot to Sign">Forgot to Sign Form 4</option>
                <option value="Ineligible">Ineligible (NLS)</option>
              </select>
            </div>

            {role === 'proctor' && (
              <button
                onClick={handleForceReset}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-black shadow-sm transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Schedule
              </button>
            )}
          </div>

          {/* MOBILE DIRECTORY LIST VIEW (< md screens) & DESKTOP TABLE VIEW (>= md screens) */}
          <div className={`${glassContainerStyle} p-2 sm:p-0`}>
            
            {/* MOBILE CARD VIEW */}
            <div className="block md:hidden space-y-2.5">
              {filteredStudents.length === 0 ? (
                <div className="p-8 text-center text-slate-600 font-bold text-xs">
                  No students found matching current filters.
                </div>
              ) : (
                filteredStudents.map(student => (
                  <div key={student.id} className="bg-white/40 backdrop-blur-2xl border border-white/80 rounded-2xl p-3 space-y-2.5 shadow-sm">
                    <div className="flex items-start justify-between gap-2 border-b border-white/60 pb-2">
                      <div>
                        <div 
                          className={`font-black text-slate-900 text-xs flex items-center gap-1.5 ${role === 'proctor' ? 'text-blue-900' : ''}`}
                          onClick={() => role === 'proctor' && setEditingStudent(student)}
                        >
                          {student.name}
                          {role === 'proctor' && <Edit3 className="w-3 h-3 text-slate-400" />}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono font-bold mt-0.5">{student.lrn}</div>
                      </div>

                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-white/70 text-slate-800 border border-white">
                        {student.section}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white/30 p-2 rounded-xl border border-white/60">
                        <span className="text-[9px] font-black uppercase text-slate-500 block">Session & Laptop</span>
                        {role === 'proctor' && student.isEligible ? (
                          <select
                            value={student.session}
                            onChange={e => handleSessionDirectChange(student.id, e.target.value)}
                            className="w-full bg-blue-50/90 text-blue-900 font-black border border-blue-200 rounded-lg p-1 text-[11px] mt-1"
                          >
                            <option value="Day 1 - Session 1">Day 1 - Session 1</option>
                            <option value="Day 1 - Session 2">Day 1 - Session 2</option>
                            <option value="Day 2 - Session 1">Day 2 - Session 1</option>
                            <option value="Day 2 - Session 2">Day 2 - Session 2</option>
                            <option value="Day 3 - Session 1">Day 3 - Session 1</option>
                            <option value="Day 3 - Session 2">Day 3 - Session 2</option>
                            <option value="Make-up Session">Make-up Session</option>
                            <option value="Non-Pullout">Non-Pullout</option>
                          </select>
                        ) : (
                          <p className="font-black text-blue-900 text-[11px] mt-0.5">
                            {student.session} {student.assignedSeat ? `(#${student.assignedSeat})` : ''}
                          </p>
                        )}
                      </div>

                      <div className="bg-white/30 p-2 rounded-xl border border-white/60">
                        <span className="text-[9px] font-black uppercase text-slate-500 block">Exam Status</span>
                        {role === 'proctor' && student.isEligible ? (
                          <select
                            value={student.status}
                            onChange={e => handleStatusChange(student.id, e.target.value as Student['status'])}
                            className="w-full bg-white/80 text-slate-900 font-black border border-slate-200 rounded-lg p-1 text-[11px] mt-1"
                          >
                            <option value="Not Started">Not Started</option>
                            <option value="In Exam">In Exam</option>
                            <option value="Completed">Completed</option>
                            <option value="Absent">Absent / Error</option>
                            <option value="Forgot to Sign">Forgot to Sign Form 4</option>
                            <option value="Ineligible">Ineligible (NLS)</option>
                          </select>
                        ) : (
                          <p className="font-black text-slate-800 text-[11px] mt-0.5">
                            {student.status}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/40 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-slate-600">Form 4:</span>
                        {role === 'proctor' && student.isEligible ? (
                          <select
                            value={student.signedAttendance ? 'signed' : 'unsigned'}
                            onChange={e => handleAttendanceChange(student.id, e.target.value === 'signed')}
                            className="bg-white/80 text-slate-900 font-black border border-slate-200 rounded-lg px-2 py-0.5 text-[10px]"
                          >
                            <option value="signed">✓ Signed</option>
                            <option value="unsigned">✕ Unsigned</option>
                          </select>
                        ) : (
                          <span className={`text-[10px] font-black ${student.signedAttendance ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {student.signedAttendance ? '✓ Signed' : '✕ Unsigned'}
                          </span>
                        )}
                      </div>

                      {role === 'proctor' && (
                        <button
                          onClick={() => setEditingStudent(student)}
                          className="px-2.5 py-1 bg-white/80 hover:bg-white rounded-lg text-[10px] font-black text-blue-800 border border-white"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* DESKTOP TABLE VIEW */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/30 border-b border-white/60 text-slate-600 text-xs font-black uppercase tracking-wider">
                    <th className="py-4 px-5">LRN & Student Name</th>
                    <th className="py-4 px-5">Section</th>
                    <th className="py-4 px-5">Assigned Session & Laptop #</th>
                    <th className="py-4 px-5">Exam Status</th>
                    <th className="py-4 px-5 text-center">Form 4 Signed</th>
                    {role === 'proctor' && <th className="py-4 px-5 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/40 text-sm">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-600 font-bold">
                        No students found matching current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map(student => (
                      <tr key={student.id} className={`hover:bg-white/40 transition ${!student.isEligible ? 'opacity-50 bg-slate-100/20' : ''}`}>
                        <td className="py-4 px-5">
                          <div 
                            className={`font-black text-slate-900 flex items-center gap-2 ${role === 'proctor' ? 'cursor-pointer hover:text-blue-700' : ''}`}
                            onClick={() => role === 'proctor' && setEditingStudent(student)}
                          >
                            {student.name}
                            {role === 'proctor' && <Edit3 className="w-3 h-3 text-slate-400 opacity-60" />}
                            {!student.isEligible && (
                              <span className="bg-white/60 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1 border border-white">
                                <Ban className="w-3 h-3 text-rose-500" /> NLS
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 font-mono font-bold mt-0.5">{student.lrn}</div>
                        </td>

                        <td className="py-4 px-5">
                          <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-black bg-white/60 text-slate-800 border border-white shadow-sm">
                            {student.section}
                          </span>
                        </td>

                        <td className="py-4 px-5 text-slate-700 text-xs">
                          {role === 'proctor' && student.isEligible ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <select
                                value={student.session}
                                onChange={e => handleSessionDirectChange(student.id, e.target.value)}
                                className="bg-blue-50/90 text-blue-900 font-black border border-blue-200 rounded-xl px-3 py-1 text-xs focus:outline-none shadow-sm"
                              >
                                <option value="Day 1 - Session 1">Day 1 - Session 1</option>
                                <option value="Day 1 - Session 2">Day 1 - Session 2</option>
                                <option value="Day 2 - Session 1">Day 2 - Session 1</option>
                                <option value="Day 2 - Session 2">Day 2 - Session 2</option>
                                <option value="Day 3 - Session 1">Day 3 - Session 1</option>
                                <option value="Day 3 - Session 2">Day 3 - Session 2</option>
                                <option value="Make-up Session">Make-up Session</option>
                                <option value="Non-Pullout">Non-Pullout</option>
                              </select>
                              {student.assignedSeat && (
                                <span className="bg-indigo-600 text-white text-[11px] font-black px-2.5 py-1 rounded-xl shadow-sm">
                                  Laptop #{student.assignedSeat}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="px-3 py-1 rounded-xl border font-black bg-blue-50/90 text-blue-900 border-blue-200/80 shadow-sm">
                              {student.session} {student.assignedSeat ? `(Laptop #${student.assignedSeat})` : ''}
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-5">
                          {role === 'proctor' && student.isEligible ? (
                            <select
                              value={student.status}
                              onChange={e => handleStatusChange(student.id, e.target.value as Student['status'])}
                              className="text-xs font-black px-3 py-1.5 rounded-xl border shadow-sm bg-white/80 text-slate-700"
                            >
                              <option value="Not Started">Not Started</option>
                              <option value="In Exam">In Exam</option>
                              <option value="Completed">Completed</option>
                              <option value="Absent">Absent / Error</option>
                              <option value="Forgot to Sign">Forgot to Sign Form 4</option>
                              <option value="Ineligible">Ineligible (NLS)</option>
                            </select>
                          ) : (
                            <span className="inline-block text-xs font-black px-3 py-1 rounded-xl border bg-slate-100 text-slate-800">
                              {student.status}
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-5 text-center">
                          {role === 'proctor' && student.isEligible ? (
                            <select
                              value={student.signedAttendance ? 'signed' : 'unsigned'}
                              onChange={e => handleAttendanceChange(student.id, e.target.value === 'signed')}
                              className="text-xs font-black px-3 py-1.5 rounded-xl border bg-white/80"
                            >
                              <option value="signed">✓ Signed Form 4</option>
                              <option value="unsigned">✕ Unsigned</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black ${student.signedAttendance ? 'text-emerald-900' : 'text-slate-500'}`}>
                              {student.signedAttendance ? '✓ Signed Form 4' : '✕ Unsigned'}
                            </span>
                          )}
                        </td>

                        {role === 'proctor' && (
                          <td className="py-4 px-5 text-right">
                            <button
                              onClick={() => setEditingStudent(student)}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-white/80 hover:bg-white border border-white rounded-xl text-slate-800 text-xs font-black shadow-sm"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-blue-700" /> Edit
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-white/40 backdrop-blur-3xl border-t border-white/60 px-4 sm:px-6 py-3 flex items-center justify-between text-xs font-black text-slate-800">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-700" />
                <span>Filtered: <span className="text-blue-800 font-black">{filteredStudents.length} Students</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-8 pt-4 border-t border-white/60 text-center text-[10px] sm:text-xs font-black text-slate-500/80 tracking-widest uppercase relative z-10">
        JUDIMER ZARATE — BAGONBON NHS NCAE 2026 PORTAL
      </footer>

      {/* SEAT / LAPTOP ASSIGNMENT MODAL */}
      {selectedSeatModal && role === 'proctor' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xl flex items-center justify-center p-4 z-50">
          <div className="bg-white/30 backdrop-blur-3xl border border-white/80 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/60 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">Assign Laptop #{selectedSeatModal}</h3>
                <p className="text-xs text-blue-900 font-black mt-0.5">Session: {selectedSession}</p>
              </div>
              <button
                onClick={() => setSelectedSeatModal(null)}
                className="p-1.5 bg-white/60 hover:bg-white rounded-full text-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              <button
                onClick={() => handleAssignSeat(selectedSeatModal, null)}
                className="w-full p-2.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-300 rounded-xl text-left text-xs font-black text-rose-900 transition flex items-center justify-between"
              >
                <span>✕ Clear Laptop Assignment</span>
              </button>

              {sessionStudents.filter(s => s.isEligible).map(student => {
                const isCurrentlySeatedHere = student.assignedSeat === selectedSeatModal;

                return (
                  <button
                    key={student.id}
                    onClick={() => handleAssignSeat(selectedSeatModal, student.id)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition flex items-center justify-between border ${
                      isCurrentlySeatedHere
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-white/60 hover:bg-white/90 border-white text-slate-900'
                    }`}
                  >
                    <div>
                      <p className="font-black">{student.name}</p>
                      <p className={`text-[10px] ${isCurrentlySeatedHere ? 'text-indigo-200' : 'text-slate-600'}`}>
                        {student.section} • {student.lrn}
                      </p>
                    </div>

                    {student.assignedSeat && !isCurrentlySeatedHere ? (
                      <span className="text-[10px] font-black bg-white/80 text-slate-700 px-2 py-0.5 rounded-full border">
                        Laptop #{student.assignedSeat}
                      </span>
                    ) : isCurrentlySeatedHere ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-white/60 text-right">
              <button
                onClick={() => setSelectedSeatModal(null)}
                className="px-4 py-2 bg-white/60 hover:bg-white text-slate-800 rounded-xl text-xs font-black border border-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editingStudent && role === 'proctor' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xl flex items-center justify-center p-4 z-50">
          <div className="bg-white/30 backdrop-blur-3xl border border-white/80 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">Edit Student Record</h3>
              <p className="text-xs text-blue-800 font-black">Section: {editingStudent.section}</p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingStudent.name}
                  onChange={e => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="w-full bg-white/60 border border-white/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">LRN</label>
                <input
                  type="text"
                  value={editingStudent.lrn}
                  onChange={e => setEditingStudent({ ...editingStudent, lrn: e.target.value })}
                  className="w-full bg-white/60 border border-white/80 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">Assigned Session</label>
                <input
                  type="text"
                  value={editingStudent.session}
                  onChange={e => setEditingStudent({ ...editingStudent, session: e.target.value })}
                  className="w-full bg-white/60 border border-white/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">Form 4 Attendance</label>
                <select
                  value={editingStudent.signedAttendance ? 'signed' : 'unsigned'}
                  onChange={e => setEditingStudent({ ...editingStudent, signedAttendance: e.target.value === 'signed' })}
                  className="w-full bg-white/60 border border-white/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                >
                  <option value="signed">✓ Signed Form 4</option>
                  <option value="unsigned">✕ Unsigned</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">Exam Status</label>
                <select
                  value={editingStudent.status}
                  onChange={e => setEditingStudent({ ...editingStudent, status: e.target.value as Student['status'] })}
                  className="w-full bg-white/60 border border-white/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Exam">In Exam</option>
                  <option value="Completed">Completed</option>
                  <option value="Absent">Absent / Error</option>
                  <option value="Forgot to Sign">Forgot to Sign Form 4</option>
                  <option value="Ineligible">Ineligible (NLS)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/60">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 bg-white/50 text-slate-800 rounded-xl text-xs font-black border border-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
