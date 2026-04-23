import { PrismaClient } from '@prisma/client';

import { Farm } from '../../farms/models/farms.model';
import { FarmsService } from 'src/farms/farms.service';
export const seedSurvey = async (
  prisma: PrismaClient,
  user2,
  farmService: FarmsService,
  organisation: string,
) => {
  const survey = await prisma.survey.create({
    data: {
      organisation,
      title: 'Farm Management Survey',
      description: 'Survey to assess farm management practices.',
      createdBy: user2.id,
      updatedBy: user2.id,
    },
  });

  const section1 = await prisma.section.create({
    data: {
      name: 'Crop Management',
    },
  });

  const section2 = await prisma.section.create({
    data: {
      name: 'Livestock Care',
    },
  });

  // Create Survey Questions for Crop Management
  const question1 = await prisma.surveyQuestion.create({
    data: {
      question: 'What type of crops do you grow?',
      answerType: 'text',
      answerOptions: '1,2,3,4,5',
      min: 1,
      max: 5,
      surveyId: survey.id,
      sectionId: section1.id,
      unique_key: 'Q1',
      sorting_index: 1,
      description: 'List the types of crops you cultivate.',
    },
  });

  const question2 = await prisma.surveyQuestion.create({
    data: {
      question: 'How do you rate your soil health?',
      answerType: 'rating',
      answerOptions: '1,2,3,4,5',
      min: 1,
      max: 5,
      surveyId: survey.id,
      sectionId: section1.id,
      unique_key: 'Q2',
      sorting_index: 2,
      description: 'Rate the health of your soil on a scale of 1 to 5.',
    },
  });

  // Create Survey Questions for Livestock Care
  const question3 = await prisma.surveyQuestion.create({
    data: {
      question: 'What types of livestock do you have?',
      answerType: 'text',
      answerOptions: '1,2,3,4,5',
      surveyId: survey.id,
      sectionId: section2.id,
      min: 1,
      max: 5,
      unique_key: 'Q3',
      sorting_index: 3,
      description: 'List the types of livestock you raise.',
    },
  });

  const question4 = await prisma.surveyQuestion.create({
    data: {
      question: 'How do you rate the health of your livestock?',
      answerType: 'rating',
      answerOptions: '1,2,3,4,5',
      min: 1,
      max: 5,
      surveyId: survey.id,
      sectionId: section2.id,
      unique_key: 'Q4',
      sorting_index: 4,
      description: 'Rate the health of your livestock on a scale of 1 to 5.',
    },
  });

  const farmsWithIncludes: { data: any[]; count: number } =
    await farmService.getMany({
      organisation: organisation,
    });
  const farmOne = farmsWithIncludes.data.find(
    (farm: Farm) => farm.facility.shortCode === 'FARM-001',
  );
  // Create Survey Results
  const surveyResult1 = await prisma.surveyResult.create({
    data: {
      createdBy: user2.id,
      updatedBy: user2.id,
      surveyId: survey.id,
      farmId: farmOne.id,
    },
  });

  // Create Survey Answers
  await prisma.surveyAnswer.create({
    data: {
      survey_result_id: surveyResult1.id,
      survey_question_id: question1.id,
      answer: 'Wheat, Corn',
    },
  });

  await prisma.surveyAnswer.create({
    data: {
      survey_result_id: surveyResult1.id,
      survey_question_id: question2.id,
      answer: '4',
    },
  });

  await prisma.surveyAnswer.create({
    data: {
      survey_result_id: surveyResult1.id,
      survey_question_id: question3.id,
      answer: 'Cattle, Sheep',
    },
  });

  await prisma.surveyAnswer.create({
    data: {
      survey_result_id: surveyResult1.id,
      survey_question_id: question4.id,
      answer: '5',
    },
  });
};
