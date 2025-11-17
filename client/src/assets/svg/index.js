// Export from component-specific folders
export * from './about';
export * from './contact';
export * from './homepage';
export * from './howitworks';
export * from './products';
export * from './questionbank';
export * from './shared';
export * from './navbar';

// Import and re-export for compatibility
import { ideas } from './about';
import { contactherologo, email, whatsapp, twitters, instagrams, linkedins, youtubes, tiktoks } from './contact';
import { buttonvedio, heropagelogo, herocardimg1, herocardimg2, herocardimg3, addperson, bookcard, starvalue, boxcard, applecard, applecards2, aboutherologo } from './homepage';
import { logoimg, logoimg1, loopscard1, loopcard1, loopcard2, loopcard3, loopcard4, loopcard5, greaterthan, timinggraph, learningcard1, learningcard2, brain, brainvedio, effortcard1, mindyouget, mindyouget2, mindyouget3, mindyouget4, mindyouget5, downtick } from './howitworks';
import { computer, bookIcon, videoIcon, checkCircleIcon, phoneIcon } from './products';
import { mind, book, ielts, toefl, add, feature, lock, arrowup } from './questionbank';
import { fb, instagram, linkedin, youtube, twitter, logofooter, rightarrow, tick, tickbg, applecard2, dropdownArrow, dropdownArrowAdmin, chevronDown, chevronDownSmall, check, x } from './shared';
import { navlogo, downarrow, hamburger } from './navbar';
import fevicon from './fevicon.svg';

// Re-export all individually for compatibility
export {
  ideas,
  contactherologo,
  email,
  whatsapp,
  twitters,
  instagrams,
  linkedins,
  youtubes,
  tiktoks,
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
  fevicon
};