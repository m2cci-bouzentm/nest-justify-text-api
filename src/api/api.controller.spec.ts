import {
  BadRequestException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JustifyTextService } from '../justify-text/justify-text.service';
import { PrismaService } from '../prisma/prisma.service';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { JwtService } from '@nestjs/jwt';
import { before } from 'node:test';

describe('ApiController', () => {
  let apiController: ApiController;
  let apiService: ApiService;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let justifyTextService: JustifyTextService;
  let mockToken: string;

  const jsonContentType: string = 'application/json';
  const textContentType: string = 'text/plain';

  let rawText: string;
  let rawTextSplited: string[];
  let justifiedText: string[];
  let justifiedText2: string[];

  beforeEach(() => {
    prisma = new PrismaService();
    jwtService = new JwtService({
      global: true,
      secret: process.env.SECRET,
      signOptions: { expiresIn: '30 days' },
    });
    justifyTextService = new JustifyTextService();
    apiService = new ApiService(justifyTextService, prisma, jwtService);
    apiController = new ApiController(apiService);
  });

  describe('tokenEndPoint', () => {
    it('should return "Email is required"', async () => {
      const result = 'Email is required';
      jest
        .spyOn(apiService, 'registreUser')
        .mockImplementation(async () => Promise.resolve(result));
      // hitting th end point without an email in the body
      expect(await apiController.registreUser('', jsonContentType)).toBe(
        result,
      );
    });

    it("should return an already registred user's token", async () => {
      // The user must exist in the database before testing
      const email = 'mohamed@gmail.com';
      const mockMinLengthToken = 150;
      const token = await apiController.registreUser(email, jsonContentType);
      expect(token.length).toBeGreaterThan(mockMinLengthToken);
    });

    it("should return a new registred user's token", async () => {
      // generate random fake email
      const email = Math.floor(Math.random() * 987654) + '@gmail.com';
      const mockMinLengthToken = 150;
      const token = await apiController.registreUser(email, jsonContentType);
      expect(token.length).toBeGreaterThan(mockMinLengthToken);
    });
  });

  describe('justifyEndPoint', () => {
    before(() => {
      mockToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vaGFtZWRAZ21haWwuY29tIiwiaWF0IjoxNzMxMjQxOTA5LCJleHAiOjE3MzM4MzM5MDl9.I2NYGnFuWpVAZf3IdXAuxGX8FsazXTrKbVf1NI5ZPcY';

      // jsutified text samples with a length of 80
      // 173 word
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

      justifiedText = [
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

    it.only('should throw invalid body type exception', async () => {
      // The user must exist in the database before running this test
      const result = new HttpException(
        `Invalid body type. Expected ${textContentType}`,
        HttpStatus.BAD_REQUEST,
      );
      const headers = {
        authorization: mockToken,
        contentType: jsonContentType,
      };
      const body = { text: rawText };
      const test = await apiController.justifyText(
        body.text,
        headers.authorization,
        headers.contentType,
      );
      expect(test.split('\n')).rejects.toThrow(result);
    });

    it('should throw an "UnauthorizedException" when a token isn\'t included in the request', () => {
      // The user must exist in the database before testing
      const result = new UnauthorizedException(
        'You need to register using an email at /api/token before justifying any text or include your token in the authorization header if already registered.',
      );
      const headers = { authorization: '', contentType: textContentType };
      const body = { text: rawText };

      expect(
        apiController.justifyText(
          body.text,
          headers.authorization,
          headers.contentType,
        ),
      ).rejects.toThrow(result);
    });

    it('should return a justified text', async () => {
      // The user must exist in the database before running this test
      const headers = {
        authorization: mockToken,
        contentType: textContentType,
      };
      const body1 = { text: rawText };
      const body2 = { text: rawTextSplited.join(' ') };

      const test1 = await apiController.justifyText(
        body1.text,
        headers.authorization,
        headers.contentType,
      );
      const test2 = await apiController.justifyText(
        body2.text,
        headers.authorization,
        headers.contentType,
      );

      expect(test1.split('\n')).toStrictEqual(justifiedText);
      expect(test2.split('\n')).toStrictEqual(justifiedText2);
    });

    it('should return an "HttpException". Payment required.', () => {
      // Pre-test setup
      // The user must exist in the database before running this test
      // Adjust MAX_DAILY_WORDS limits in the environment variables if needed
      // Run as the only test if need. Use it.only instead of it

      const headers = {
        authorization: mockToken,
        contentType: textContentType,
      };
      const body = { text: rawText };

      const expectedException = new HttpException(
        'Surpassed Daily limit. Payment required.',
        HttpStatus.PAYMENT_REQUIRED,
      );

      const test = apiController.justifyText(
        body.text,
        headers.authorization,
        headers.contentType,
      );

      expect(test).rejects.toThrow(expectedException);
    });
  });
});
