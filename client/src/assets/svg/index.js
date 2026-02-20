// Export from component-specific folders
export * from './about';
export * from './contact';
export * from './homepage';
export * from './howitworks';
export * from './products';
export * from './questionbank';
export * from './shared';
export * from './navbar';
export * from './signup';
export * from './dashboard';
export * from './dashboard/subscription';
export * from './dashboard/analytics';
// Import and re-export for compatibility
import { ideas, aboutheroimage, whywestartedimage } from './about';
import { contactherologo, email, whatsapp, twitters, instagrams, linkedins, youtubes, tiktoks, heroimage } from './contact';
import { buttonvedio, heropagelogo, herocardimg1, herocardimg2, herocardimg3, addperson, bookcard, starvalue, boxcard, applecard, applecards2, aboutherologo, orangebook, orangeaim, orangesmart, teamicon, bookicon, progressicon, flaskicon, bookicon2, brainicon, hearticon } from './homepage';
import { logoimg, logoimg1, loopscard1, loopcard1, loopcard2, loopcard3, loopcard4, loopcard5, greaterthan, timinggraph, learningcard1, learningcard2, brain, brainvedio, effortcard1, mindyouget, mindyouget2, mindyouget3, mindyouget4, mindyouget5, downtick, orangebrainicon, metericon, restoreicon, aimicon } from './howitworks';
import { computer, bookIcon, videoIcon, checkCircleIcon, phoneIcon, tryfreeimage, checklist, calendar, bulb, flask, aim, statsicon, teamiconorange, playicon } from './products';
import { mind, book, ielts, toefl, add, feature, lock, arrowup } from './questionbank';
import { fb, instagram, linkedin, youtube, twitter, logofooter, rightarrow, tick, tickbg, applecard2, dropdownArrow, dropdownArrowAdmin, chevronDown, chevronDownSmall, check, x } from './shared';
import { navlogo, downarrow, hamburger } from './navbar';
import fevicon from './fevicon.svg';
import {lockicon, shield, mailsent, resetpassword, success} from './signup';
import { progress, statsprogress, stats, streak, completed, question, notice, dashboardplayicon, dashboardstatsicon, dashboardhistoryicon } from './dashboard';
import { access, calender, document, renew, invoice } from './dashboard/subscription';
import { questionmark, target, timericon } from './dashboard/analytics';
// Re-export all individually for compatibility
export {
  ideas,
  aboutheroimage,
  whywestartedimage,
  contactherologo,
  email,
  whatsapp,
  twitters,
  instagrams,
  linkedins,
  youtubes,
  tiktoks,
  heroimage,
  buttonvedio,
  heropagelogo,
  herocardimg1,
  herocardimg2,
  herocardimg3,
  addperson,
  bookcard,
  starvalue,
  boxcard,
  applecard,
  applecards2,
  aboutherologo,
  orangebook,
  orangeaim,
  orangesmart,
  teamicon,
  bookicon,
  progressicon,
  flaskicon,
  bookicon2,
  brainicon,
  hearticon,
  logoimg,
  logoimg1,
  loopscard1,
  loopcard1,
  loopcard2,
  loopcard3,
  loopcard4,
  loopcard5,
  greaterthan,
  timinggraph,
  learningcard1,
  learningcard2,
  brain,
  brainvedio,
  effortcard1,
  mindyouget,
  mindyouget2,
  mindyouget3,
  mindyouget4,
  mindyouget5,
  downtick,
  computer,
  bookIcon,
  videoIcon,
  checkCircleIcon,
  phoneIcon,
  tryfreeimage,
  mind,
  book,
  ielts,
  toefl,
  add,
  feature,
  lock,
  arrowup,
  fb,
  instagram,
  linkedin,
  youtube,
  twitter,
  logofooter,
  rightarrow,
  tick,
  tickbg,
  applecard2,
  dropdownArrow,
  dropdownArrowAdmin,
  chevronDown,
  chevronDownSmall,
  check,
  x,
  navlogo,
  downarrow,
  hamburger,
  fevicon,
  orangebrainicon,
  metericon,
  restoreicon,
  aimicon,
  checklist,
  calendar,
  bulb,
  flask,
  aim,
  statsicon,
  playicon,
  teamiconorange,
  lockicon,
  shield,
  mailsent,
  resetpassword,
  success,
  progress,
  statsprogress,
  stats,
  streak,
  completed,
  question,
  notice,
  dashboardplayicon,
  dashboardstatsicon,
  dashboardhistoryicon,
  access,
  calender,
  document,
  renew,
  invoice,
  questionmark,
  target,
  timericon,
};