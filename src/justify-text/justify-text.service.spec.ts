import { Test, TestingModule } from '@nestjs/testing';
import { JustifyTextService } from './justify-text.service';

describe('JustifyTextService', () => {
  let justifytextService: JustifyTextService;
  let rawText: string;
  let rawTextSplited: string[];
  let justifiedText1: string[];
  let justifiedText2: string[];

  beforeEach(async () => {
    // jsutified text samples with a length of 80
    // 173 word
    justifytextService = new JustifyTextService();
    
    rawText =
      'On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.';

    // 49 word
    rawTextSplited = [
      'With',
      'the',
      'advent',
      'of',
      '',
      '',
      '',
      'artificial',
      'intelligence',
      'and',
      'machine',
      'learning',
      'technologies',
      'we',
      'are',
      'on',
      'the',
      'cusp',
      'of',
      'a',
      'new',
      'era',
      'where',
      'machines',
      'are',
      'able',
      'to',
      'perform',
      'tasks',
      'that',
      'were',
      'once',
      'considered',
      'exclusive',
      'to',
      'humans.',
      'This',
      'transformation',
      'is',
      'reshaping',
      'industries',
      'and',
      'changing',
      'the',
      'way',
      'we',
      'work',
      'and',
      'live.',
    ];

    justifiedText1 = [
      'On  the  other  hand, we denounce with righteous indignation and dislike men who',
      'are  so  beguiled  and  demoralized  by the charms of pleasure of the moment, so',
      'blinded  by desire, that they cannot foresee the pain and trouble that are bound',
      'to  ensue;  and  equal  blame  belongs  to  those who fail in their duty through',
      'weakness  of  will,  which is the same as saying through shrinking from toil and',
      'pain.  These cases are perfectly simple and easy to distinguish. In a free hour,',
      'when  our  power  of  choice is untrammelled and when nothing prevents our being',
      'able  to  do  what we like best, every pleasure is to be welcomed and every pain',
      'avoided.  But  in  certain  circumstances and owing to the claims of duty or the',
      'obligations  of  business  it  will  frequently  occur that pleasures have to be',
      'repudiated and annoyances accepted. The wise man therefore always holds in these',
      'matters  to  this  principle  of selection: he rejects pleasures to secure other',
      'greater pleasures, or else he endures pains to avoid worse pains.               ',
    ];
    justifiedText2 = [
      'With  the advent of    artificial intelligence and machine learning technologies',
      'we  are  on  the cusp of a new era where machines are able to perform tasks that',
      'were  once  considered  exclusive  to  humans.  This transformation is reshaping',
      'industries and changing the way we work and live.                               ',
    ];
  });

  it('should return jsutified text with a length of 80', () => {
    expect(
      justifytextService.fullJustify(rawText.split(' '), 80),
    ).toStrictEqual(justifiedText1);
    expect(justifytextService.fullJustify(rawTextSplited, 80)).toStrictEqual(
      justifiedText2,
    );
  });
});
