'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Users, CheckCircle, Clock, AlertTriangle, FileSpreadsheet, 
  Search, Filter, Shield, UserCheck, Edit3, UserX, FileSignature, 
  Sparkles, RefreshCw, Layers, CheckSquare, Square, Wifi, WifiOff,
  GraduationCap, ArrowRight, LogOut, Ban, Calendar, Hash, Sun, Moon, Sunrise
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
}

const INITIAL_STUDENTS: Student[] = [
  // 10 - THORNDIKE (34 Total Students)
  { id: 'th-1', lrn: '117792150055', name: 'ALISNA, JULIET, CALAPUAN', section: 'Thorndike', gender: 'F', session: 'Oct 13 - Session 1', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-2', lrn: '117792160061', name: 'ARIOSTE, SHAJARA, CABURNAY', section: 'Thorndike', gender: 'F', session: 'Oct 13 - Session 1', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-3', lrn: '117792160043', name: 'BARCOMA, JASCENT CLEAR, ISOGAN', section: 'Thorndike', gender: 'F', session: 'Oct 13 - Session 1', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-4', lrn: '117797160026', name: 'BAYOG-ANG, JAY MARK, SARNO', section: 'Thorndike', gender: 'M', session: 'Oct 13 - Session 1', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-5', lrn: '117792160029', name: 'BOLIBOLI, JOVESEIL, OLBEDENCIA', section: 'Thorndike', gender: 'M', session: 'Oct 13 - Session 1', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-6', lrn: '117792160078', name: 'BRADY, JAMAICA, -', section: 'Thorndike', gender: 'F', session: 'Oct 13 - Session 1', status: 'Not Started', signedAttendance: false, isEligible: true },

  { id: 'th-7', lrn: '117797160002', name: 'CANONOY, ROGELIO JR, ANDRAQUE', section: 'Thorndike', gender: 'M', session: 'Oct 14 - Session 2', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-8', lrn: '117792160045', name: 'DAYONDON, JIMESRYL, PILAPIL', section: 'Thorndike', gender: 'M', session: 'Oct 14 - Session 2', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-9', lrn: '117797140029', name: 'DEL ROSARIO, VIRGILLIO JR, MAG-ASO', section: 'Thorndike', gender: 'M', session: 'Oct 14 - Session 2', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-10', lrn: '117797160024', name: 'DELUBIO, SHERLYN, DELIMA', section: 'Thorndike', gender: 'F', session: 'Oct 14 - Session 2', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-11', lrn: '117796140020', name: 'ESPLAGUERA, JENNYL, VERBO', section: 'Thorndike', gender: 'F', session: 'Oct 14 - Session 2', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-12', lrn: '116093160022', name: 'GABIA, CHRISSAN, ARBOLEDA', section: 'Thorndike', gender: 'F', session: 'Oct 14 - Session 2', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-13', lrn: '117792150055', name: 'GALLARDO, MARIAN, RAFAEL', section: 'Thorndike', gender: 'F', session: 'Oct 14 - Session 2', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-14', lrn: '117792160012', name: 'GALLARDO, NELBELENE, ASEGURADO', section: 'Thorndike', gender: 'F', session: 'Oct 14 - Session 2', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-15', lrn: '117792160033', name: 'GONZAGA, JOSH ANDREE, TAPDASAN', section: 'Thorndike', gender: 'M', session: 'Oct 14 - Session 2', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-16', lrn: '117792160034', name: 'HILIGAN, JHON PAOLO, JUANITO', section: 'Thorndike', gender: 'M', session: 'Oct 14 - Session 2', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-17', lrn: '117797160005', name: 'JERANDOY, JOVENOEL, DENEROS', section: 'Thorndike', gender: 'M', session: 'Oct 14 - Session 2', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-18', lrn: '117792160067', name: 'LARIOSA, RINELEN, BARANGGAN', section: 'Thorndike', gender: 'F', session: 'Oct 14 - Session 2', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-19', lrn: '117792160082', name: 'LEMORAN, JHOVY MAR, EWICAN', section: 'Thorndike', gender: 'M', session: 'Oct 14 - Session 2', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-20', lrn: '117792160023', name: 'MAHUSAY, JAMES, PASI', section: 'Thorndike', gender: 'M', session: 'Oct 14 - Session 2', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-21', lrn: '117792150073', name: 'MANDALONES, AYENA, - (NLS)', section: 'Thorndike', gender: 'F', session: 'Non-Pullout', status: 'Ineligible', customStatus: 'Non-Learner / Ineligible', signedAttendance: false, isEligible: false },
  { id: 'th-22', lrn: '117792160069', name: 'MELLAS, ZYRIEL ANN, COGONON', section: 'Thorndike', gender: 'F', session: 'Oct 14 - Session 2', status: 'Not Started', signedAttendance: false, isEligible: true },

  { id: 'th-23', lrn: '117797160016', name: 'NAVAJA, ANGELICA, PACALDO', section: 'Thorndike', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-24', lrn: '117792160014', name: 'NAVARRO, JELYN MAE, MAQUISA', section: 'Thorndike', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-25', lrn: '117792160015', name: 'NAVARRO, JOVEMAR, JR DESTACAMENTO', section: 'Thorndike', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-26', lrn: '117792160085', name: 'ORDONIO, RICHMER, CABALLERO', section: 'Thorndike', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-27', lrn: '117792160053', name: 'PILAPIL, JECKNEY, MOSQUIDA', section: 'Thorndike', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-28', lrn: '117792160054', name: 'PILAPIL, LEONARD, PASULOT', section: 'Thorndike', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-29', lrn: '117792160071', name: 'SABERON, JAHAZIEL, JUANILLO', section: 'Thorndike', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-30', lrn: '117797150018', name: 'SARNO, ROVEC, OLIVERIO', section: 'Thorndike', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-31', lrn: '126529140010', name: 'VILLAHERMOSA, JOMAR, CARUSCAY', section: 'Thorndike', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-32', lrn: '128387160003', name: 'VILLAJOS, LEA MAE, CABALLERO', section: 'Thorndike', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-33', lrn: '117792160040', name: 'VILLAREAL, JONA GRACE, GEQUE', section: 'Thorndike', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'th-34', lrn: '117796170021', name: 'VILLARMENTE, JOE, TANQUE', section: 'Thorndike', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },

  // 10 - GARDNER (29 Total Students)
  { id: 'ga-1', lrn: '117792160003', name: 'BALOSA, MARK JHON L.', section: 'Gardner', gender: 'M', session: 'Oct 13 - Session 1', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-2', lrn: '117792160056', name: 'BARING, RUSSEL E.', section: 'Gardner', gender: 'M', session: 'Oct 13 - Session 1', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-3', lrn: '117792160030', name: 'CABULONG, EJAY O.', section: 'Gardner', gender: 'M', session: 'Oct 13 - Session 1', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-4', lrn: '116909160007', name: 'ALDE, QUEENCIEVELLE R.', section: 'Gardner', gender: 'F', session: 'Oct 13 - Session 1', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-5', lrn: '117798160010', name: 'ALESNA, JUDY ANN O.', section: 'Gardner', gender: 'F', session: 'Oct 13 - Session 1', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-6', lrn: '117792160005', name: 'BRADE, JESSA MAE D.', section: 'Gardner', gender: 'F', session: 'Oct 13 - Session 1', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-7', lrn: '117792160082', name: 'BARCOMA, REYBEN', section: 'Gardner', gender: 'M', session: 'Oct 13 - Session 1', status: 'Not Started', signedAttendance: false, isEligible: true },

  { id: 'ga-8', lrn: '117792170098', name: 'DOLOR, COBBY BRYAN C.', section: 'Gardner', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-9', lrn: '117792160022', name: 'DOMINGGO, PAOLO E.', section: 'Gardner', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-10', lrn: '117792160048', name: 'GONZAGA, JOSH LYCER', section: 'Gardner', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-11', lrn: '117796160011', name: 'GORDO, FRANCIS C.', section: 'Gardner', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-12', lrn: '116908160003', name: 'HULLEZA, EDRIAN S.', section: 'Gardner', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-13', lrn: '117792160036', name: 'LEMORAN, JOCELLE MARL E.', section: 'Gardner', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-14', lrn: '117792170099', name: 'LASCONIA, RODEL D.', section: 'Gardner', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-15', lrn: '117798170026', name: 'LINGANAY, GINO D.', section: 'Gardner', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-16', lrn: '117796160013', name: 'RUBIO, JOHN ANDREW R.', section: 'Gardner', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-17', lrn: '117792160059', name: 'SABERON, JAPET R.', section: 'Gardner', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-18', lrn: '117797160007', name: 'TELEBRICO, KEVEN I.', section: 'Gardner', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-19', lrn: '117797160008', name: 'VELASCO, KIM ASHLEY D.', section: 'Gardner', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-20', lrn: '117796160007', name: 'CALAPUAN, AILEEN L.', section: 'Gardner', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-21', lrn: '117792160011', name: 'ENGGANA, JESSAMAE B.', section: 'Gardner', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-22', lrn: '117326150039', name: 'ENGGANA, WELMIROSE A.', section: 'Gardner', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-23', lrn: '116909160030', name: 'ESCOSAR, JELLY', section: 'Gardner', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-24', lrn: '116908160010', name: 'GABIA, MARIA CRISTY L.', section: 'Gardner', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-25', lrn: '117792170112', name: 'GERALDEZ, CRISTEPHIN JOY C.', section: 'Gardner', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-26', lrn: '117792160035', name: 'JUANITO, MARY ANN H.', section: 'Gardner', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-27', lrn: '117792150072', name: 'MAGBANUA, PRINCESS MABEY P.', section: 'Gardner', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-28', lrn: '117792160070', name: 'PARAN, JERAMAE A.', section: 'Gardner', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-29', lrn: '117792160018', name: 'SUMANTING, ZYAN BELLE D.', section: 'Gardner', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'ga-30', lrn: '117797160025', name: 'SOLANO, MARJELYN L.', section: 'Gardner', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },

  // 10 - DEWEY (30 Total Students)
  { id: 'de-1', lrn: '107921150317', name: 'ABUEME, MA. ANGELICA, PILAPIL', section: 'Dewey', gender: 'F', session: 'Oct 13 - Session 1', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-2', lrn: '116909160013', name: 'ALBIAR, DENNISE JEAN, PURISIMA', section: 'Dewey', gender: 'F', session: 'Oct 13 - Session 1', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-3', lrn: '117797170034', name: 'ALESNA, ANGEL, CAMPANIA', section: 'Dewey', gender: 'F', session: 'Oct 13 - Session 1', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-4', lrn: '117792160002', name: 'ALIGATO, JANELLE, RIVERA', section: 'Dewey', gender: 'F', session: 'Oct 13 - Session 1', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-5', lrn: '117792160027', name: 'ALORA, CRISTEL, SATINGASIN', section: 'Dewey', gender: 'F', session: 'Oct 13 - Session 1', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-6', lrn: '117792160055', name: 'ARELLANO, JESSICA, PACALDO', section: 'Dewey', gender: 'F', session: 'Oct 13 - Session 1', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-7', lrn: '117792160062', name: 'BARBADILLO, CHERE, BAROY', section: 'Dewey', gender: 'F', session: 'Oct 13 - Session 1', status: 'Not Started', signedAttendance: false, isEligible: true },

  { id: 'de-8', lrn: '117792160008', name: 'CONTENIDO, KYL PATRICK, CEJAS', section: 'Dewey', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-9', lrn: '117792160032', name: 'CUIZON, GIAN KLENT, -', section: 'Dewey', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-10', lrn: '117797160006', name: 'JUANILLO, JHON ROEY, CABALLERO', section: 'Dewey', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-11', lrn: '117792160052', name: 'PESODAS, MARK ANTHONY, ARELLANO', section: 'Dewey', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-12', lrn: '120755160018', name: 'RIM, DAVRYL JAMES, LESONDRA', section: 'Dewey', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-13', lrn: '117796160012', name: 'TAPIC, JHONREY, ESCOREL', section: 'Dewey', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-14', lrn: '117797160023', name: 'VILLANUEVA, DHEAN JR, CARAMIHAN', section: 'Dewey', gender: 'M', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-15', lrn: '117792160007', name: 'CALOG, MELCHIE, JUANILLO', section: 'Dewey', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-16', lrn: '117797170044', name: 'CARAMIHAN, PRECIEL JANE, DAYOHA', section: 'Dewey', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-17', lrn: '117792160031', name: 'COMPACION, PATRICE MAXXIMA, JUMAGDAO', section: 'Dewey', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-18', lrn: '117792150059', name: 'GERANDOY, KHEM, PILAPIL', section: 'Dewey', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-19', lrn: '117792160013', name: 'HERNAN, BEA MAY, YANQUIN', section: 'Dewey', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-20', lrn: '117797160017', name: 'INSIK, STELLA MARRIEZ, REMUNDA', section: 'Dewey', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-21', lrn: '116904160038', name: 'LESONDRA, MENIROSE, ALLERA', section: 'Dewey', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-22', lrn: '117792170120', name: 'LOSARITA, LAICA, LARITA', section: 'Dewey', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-23', lrn: '117797160013', name: 'MIRANDA, GEREMEH, FABELLAR', section: 'Dewey', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-24', lrn: '116904170054', name: 'PAZ, CRISTAL MAE, ESOLA', section: 'Dewey', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-25', lrn: '117797160014', name: 'PELESORES, DANICA, VILLARDE', section: 'Dewey', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-26', lrn: '117792160017', name: 'RICABORDA, PRENCISS DEVINE, APURADO', section: 'Dewey', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-27', lrn: '117798140083', name: 'ROSIANA, ANALIZA, DESTACAMENTO', section: 'Dewey', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-28', lrn: '117341160013', name: 'RUIZ, KIM, LUMANGYAO', section: 'Dewey', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
  { id: 'de-29', lrn: '117796170001', name: 'SOHOT, ROSEMARIE, TANIA', section: 'Dewey', gender: 'F', session: 'Scheduled', status: 'Not Started', signedAttendance: false, isEligible: true },
];

export default function NCAETracker() {
  const [role, setRole] = useState<'proctor' | 'adviser' | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [selectedSession, setSelectedSession] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // Time-based greeting helper
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    if (!currentTime) return { text: 'Good day, Teacher!', icon: <Sun className="w-4 h-4 text-amber-500" /> };
    const hour = currentTime.getHours();
    if (hour < 12) {
      return { text: 'Good morning, Teacher!', icon: <Sunrise className="w-4 h-4 text-amber-500" /> };
    } else if (hour < 18) {
      return { text: 'Good afternoon, Teacher!', icon: <Sun className="w-4 h-4 text-amber-500" /> };
    } else {
      return { text: 'Good evening, Teacher!', icon: <Moon className="w-4 h-4 text-indigo-500" /> };
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
    if (!data || data.length === 0 || data.length < 80) {
      await supabase.from('students').delete().neq('id', '0');
      await supabase.from('students').insert(INITIAL_STUDENTS);
      setStudents(INITIAL_STUDENTS);
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

  const handleStatusChange = async (id: string, newStatus: Student['status']) => {
    await supabase.from('students').update({ status: newStatus }).eq('id', id);
  };

  const handleAttendanceToggle = async (id: string, currentVal: boolean) => {
    await supabase.from('students').update({ signedAttendance: !currentVal }).eq('id', id);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    await supabase.from('students').update({
      lrn: editingStudent.lrn,
      session: editingStudent.session,
      status: editingStudent.status,
      customStatus: editingStudent.customStatus || ''
    }).eq('id', editingStudent.id);
    setEditingStudent(null);
  };

  const handleForceReset = async () => {
    if (confirm('Force reset database to initial 93 students with cleared statuses?')) {
      await supabase.from('students').delete().neq('id', '0');
      await supabase.from('students').insert(INITIAL_STUDENTS);
      setStudents(INITIAL_STUDENTS);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSection = selectedSection === 'All' || s.section === selectedSection;
    const matchesSession = selectedSession === 'All' || s.session === selectedSession;
    const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.lrn.includes(searchQuery);
    return matchesSection && matchesSession && matchesStatus && matchesSearch;
  });

  const totalCount = students.length;
  const completed = students.filter(s => s.status === 'Completed').length;
  const inExam = students.filter(s => s.status === 'In Exam').length;
  const absent = students.filter(s => s.status === 'Absent').length;
  const forgotSign = students.filter(s => s.status === 'Forgot to Sign' || (!s.signedAttendance && s.status === 'Completed')).length;
  const ineligibleCount = students.filter(s => !s.isEligible).length;

  const greeting = getGreeting();

  if (!role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50/50 to-indigo-50/40 text-slate-800 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
        
        {/* Soft Ambient Liquid Glass Orbs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-300/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl w-full text-center space-y-8 relative z-10">
          
          {/* Time-Based Greeting Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/70 backdrop-blur-xl border border-white/90 rounded-full shadow-sm">
            {greeting.icon}
            <span className="text-xs font-bold tracking-wide text-slate-800">
              {greeting.text}
            </span>
            {currentTime && (
              <span className="text-[11px] font-mono text-slate-400 border-l border-slate-200/80 pl-2 ml-1">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-500">
              Bagonbon National High School
            </h2>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              NCAE 2026 Portal
            </h1>
            <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto font-normal leading-relaxed pt-1">
              Real-time Examination Pull-Out & Attendance System. Select your access portal below to continue.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left pt-2">
            <button
              onClick={() => setRole('proctor')}
              className="group bg-white/70 backdrop-blur-2xl border border-white/80 hover:border-blue-400/80 p-6 rounded-3xl transition-all duration-300 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-0.5"
            >
              <div className="space-y-4">
                <div className="p-3 bg-blue-500/10 text-blue-600 rounded-2xl w-fit border border-blue-200/50">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Proctor Mode
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Full access to edit LRNs, schedules, exam statuses, and toggle attendance signatures.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                Enter as Proctor <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </button>

            <button
              onClick={() => setRole('adviser')}
              className="group bg-white/70 backdrop-blur-2xl border border-white/80 hover:border-emerald-400/80 p-6 rounded-3xl transition-all duration-300 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-0.5"
            >
              <div className="space-y-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl w-fit border border-emerald-200/50">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Adviser Mode
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Read-only view designed for section advisers to monitor live pull-out queues and totals.
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
                Enter as Adviser <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </button>
          </div>

          <div className="pt-6 border-t border-slate-200/60 flex items-center justify-center gap-2 text-xs text-slate-400">
            <span className={`inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            {isConnected ? 'Connected to Supabase Realtime' : 'Connecting to Database...'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50/40 to-indigo-50/30 text-slate-800 font-sans p-4 sm:p-6 lg:p-8 relative">
      
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/90 shadow-sm text-xs font-semibold text-slate-700">
                  {greeting.icon}
                  {greeting.text}
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${isConnected ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-200/60' : 'bg-rose-500/10 text-rose-700 border border-rose-200/60'}`}>
                  {isConnected ? <><Wifi className="w-3 h-3" /> Live Sync Active</> : <><WifiOff className="w-3 h-3" /> Connecting...</>}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-2">
                Bagonbon NHS — NCAE 2026 Portal
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">Real-time Student Pull-Out & Attendance Tracking Portal</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="flex items-center bg-white/70 backdrop-blur-xl border border-white/80 p-1 rounded-2xl shadow-sm">
            <span className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold ${
              role === 'proctor' ? 'bg-blue-600 text-white shadow-sm' : 'bg-emerald-600 text-white shadow-sm'
            }`}>
              {role === 'proctor' ? <Shield className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
              {role === 'proctor' ? 'Proctor Mode' : 'Adviser Mode'}
            </span>
            <button
              onClick={() => setRole(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-slate-500 hover:text-slate-900 text-xs font-semibold transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Exit Role
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Liquid Glass Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-white/70 backdrop-blur-xl border border-white/80 p-4 rounded-3xl shadow-sm">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Students</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalCount}</p>
          </div>
          <div className="bg-white/70 backdrop-blur-xl border border-white/80 p-4 rounded-3xl shadow-sm">
            <p className="text-amber-600 text-xs font-semibold uppercase tracking-wider">In Exam</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{inExam}</p>
          </div>
          <div className="bg-white/70 backdrop-blur-xl border border-white/80 p-4 rounded-3xl shadow-sm">
            <p className="text-emerald-600 text-xs font-semibold uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{completed}</p>
          </div>
          <div className="bg-white/70 backdrop-blur-xl border border-white/80 p-4 rounded-3xl shadow-sm">
            <p className="text-rose-600 text-xs font-semibold uppercase tracking-wider">Absent / Error</p>
            <p className="text-2xl font-black text-rose-600 mt-1">{absent}</p>
          </div>
          <div className="bg-white/70 backdrop-blur-xl border border-white/80 p-4 rounded-3xl shadow-sm">
            <p className="text-purple-600 text-xs font-semibold uppercase tracking-wider">Unsigned Form 4</p>
            <p className="text-2xl font-black text-purple-600 mt-1">{forgotSign}</p>
          </div>
          <div className="bg-white/70 backdrop-blur-xl border border-white/80 p-4 rounded-3xl shadow-sm col-span-2 md:col-span-1">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Ineligible (NLS)</p>
            <p className="text-2xl font-black text-slate-400 mt-1">{ineligibleCount}</p>
          </div>
        </div>

        {/* Liquid Glass Controls Bar */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/80 p-4 rounded-3xl shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search name or LRN..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white/80 border border-slate-200/80 rounded-2xl pl-10 pr-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 shadow-inner"
              />
            </div>

            <select
              value={selectedSection}
              onChange={e => setSelectedSection(e.target.value)}
              className="bg-white/80 border border-slate-200/80 rounded-2xl px-3.5 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 shadow-inner"
            >
              <option value="All">All Sections</option>
              <option value="Thorndike">Thorndike</option>
              <option value="Gardner">Gardner</option>
              <option value="Dewey">Dewey</option>
            </select>

            <select
              value={selectedSession}
              onChange={e => setSelectedSession(e.target.value)}
              className="bg-white/80 border border-slate-200/80 rounded-2xl px-3.5 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 shadow-inner"
            >
              <option value="All">All Sessions</option>
              <option value="Oct 13 - Session 1">Oct 13 - Session 1</option>
              <option value="Oct 14 - Session 2">Oct 14 - Session 2</option>
              <option value="Scheduled">Scheduled / Upcoming</option>
              <option value="Non-Pullout">Non-Pullout / Ineligible</option>
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="bg-white/80 border border-slate-200/80 rounded-2xl px-3.5 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 shadow-inner"
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
            <div className="flex items-center gap-2">
              <button
                onClick={handleForceReset}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-semibold shadow-md shadow-blue-500/20 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Database
              </button>
            </div>
          )}
        </div>

        {/* Liquid Glass Main Table Container */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/80 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-200/60 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-5">LRN & Student Name</th>
                  <th className="py-4 px-5">Section</th>
                  <th className="py-4 px-5">Assigned Session</th>
                  <th className="py-4 px-5">Exam Status</th>
                  <th className="py-4 px-5 text-center">Form 4 Signed</th>
                  {role === 'proctor' && <th className="py-4 px-5 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No students found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(student => (
                    <tr key={student.id} className={`hover:bg-blue-50/30 transition ${!student.isEligible ? 'opacity-50 bg-slate-50/20' : ''}`}>
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          {student.name}
                          {!student.isEligible && (
                            <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                              <Ban className="w-3 h-3 text-rose-500" /> NLS
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{student.lrn}</div>
                        {student.customStatus && (
                          <span className="inline-block mt-1 text-[11px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-md">
                            Note: {student.customStatus}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5">
                        <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100/80 text-slate-700 border border-slate-200/60">
                          {student.section}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-slate-600 text-xs">
                        <span className={`px-3 py-1 rounded-xl border font-medium ${
                          student.session.includes('Session 1') || student.session.includes('Session 2')
                            ? 'bg-blue-50/80 text-blue-700 border-blue-200/60'
                            : 'bg-slate-50 text-slate-500 border-slate-200/60'
                        }`}>
                          {student.session}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        {role === 'proctor' && student.isEligible ? (
                          <select
                            value={student.status}
                            onChange={e => handleStatusChange(student.id, e.target.value as Student['status'])}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-xl border focus:outline-none transition shadow-sm ${
                              student.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : student.status === 'In Exam'
                                ? 'bg-amber-50 text-amber-700 border-amber-300'
                                : student.status === 'Absent'
                                ? 'bg-rose-50 text-rose-700 border-rose-300'
                                : student.status === 'Forgot to Sign'
                                ? 'bg-purple-50 text-purple-700 border-purple-300'
                                : 'bg-white text-slate-600 border-slate-200'
                            }`}
                          >
                            <option value="Not Started">Not Started</option>
                            <option value="In Exam">In Exam</option>
                            <option value="Completed">Completed</option>
                            <option value="Absent">Absent / Error</option>
                            <option value="Forgot to Sign">Forgot to Sign Form 4</option>
                            <option value="Ineligible">Ineligible (NLS)</option>
                          </select>
                        ) : (
                          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-xl border ${
                            student.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : student.status === 'In Exam'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : student.status === 'Absent'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}>
                            {student.status}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5 text-center">
                        <button
                          disabled={role === 'adviser' || !student.isEligible}
                          onClick={() => handleAttendanceToggle(student.id, student.signedAttendance)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition ${
                            student.signedAttendance
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : 'bg-slate-50 text-slate-400 border-slate-200'
                          } ${role === 'adviser' || !student.isEligible ? 'cursor-not-allowed opacity-80' : 'hover:border-slate-300'}`}
                        >
                          {student.signedAttendance ? (
                            <><CheckSquare className="w-3.5 h-3.5 text-emerald-600" /> Signed</>
                          ) : (
                            <><Square className="w-3.5 h-3.5 text-slate-400" /> Unsigned</>
                          )}
                        </button>
                      </td>

                      {role === 'proctor' && (
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => setEditingStudent(student)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold transition shadow-sm"
                            title="Edit LRN, Schedule & Status"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-600" /> Edit
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editingStudent && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-2xl border border-white/90 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Edit Student Details</h3>
              <p className="text-xs text-blue-600 font-semibold mt-0.5">{editingStudent.name} ({editingStudent.section})</p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-blue-600" /> Learner Reference Number (LRN)
                </label>
                <input
                  type="text"
                  value={editingStudent.lrn}
                  onChange={e => setEditingStudent({ ...editingStudent, lrn: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 font-mono shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" /> Assigned Schedule / Session
                </label>
                <select
                  value={editingStudent.session}
                  onChange={e => setEditingStudent({ ...editingStudent, session: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 shadow-inner"
                >
                  <option value="Oct 13 - Session 1">Oct 13 - Session 1</option>
                  <option value="Oct 14 - Session 2">Oct 14 - Session 2</option>
                  <option value="Scheduled">Scheduled / Upcoming</option>
                  <option value="Non-Pullout">Non-Pullout / Ineligible</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Status</label>
                <select
                  value={editingStudent.status}
                  onChange={e => setEditingStudent({ ...editingStudent, status: e.target.value as Student['status'] })}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 shadow-inner"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Exam">In Exam</option>
                  <option value="Completed">Completed</option>
                  <option value="Absent">Absent / Error</option>
                  <option value="Forgot to Sign">Forgot to Sign Form 4</option>
                  <option value="Ineligible">Ineligible (NLS)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Custom Status / Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Needs re-session, Absent due to LMS error"
                  value={editingStudent.customStatus || ''}
                  onChange={e => setEditingStudent({ ...editingStudent, customStatus: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 shadow-inner"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-semibold shadow-md shadow-blue-500/20 transition"
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
