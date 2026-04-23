import { PrismaClient } from '@prisma/client';

const serviceCategoryTypes = [
  { shortCode: 'ID', name: 'Income Diversification' },
  { shortCode: 'EX', name: 'Extension Services' },
  { shortCode: 'QS', name: 'Quality Services' },
  { shortCode: 'FS', name: 'Financial Services' },
];

const serviceCategories = [
  { type: 'ID', shortCode: 'ID-BEE', name: 'Project	Beehives' },
  { type: 'ID', shortCode: 'ID-MAC', name: 'Project	Macademia' },
  { type: 'ID', shortCode: 'ID-RBB', name: 'Project	Rabbits' },
  { type: 'ID', shortCode: 'ID-AVO', name: 'Project	Avocado' },
  { type: 'ID', shortCode: 'ID-BEA', name: 'Project	Beans' },
  { type: 'ID', shortCode: 'ID-HON', name: 'Project	Honey' },
  { type: 'EX', shortCode: 'EX-PRUNING', name: 'Training	Pruning' },
  { type: 'EX', shortCode: 'EX-WEED', name: 'Training	Weed Management' },
  { type: 'EX', shortCode: 'EX-STUMPING', name: 'Training	Stumping' },
  { type: 'EX', shortCode: 'EX-VET', name: 'Service	Vetenary Services' },
];
const serviceInputTypes = [
  { shortCode: 'A', name: 'Alpha', type: 'Seedling', categoryRef: 'ID-BEE' },
  {
    shortCode: 'B',
    name: 'Beta',
    type: 'AnimalHousing',
    categoryRef: 'ID-MAC',
  },
  { shortCode: 'C', name: 'Gamma', type: 'Device', categoryRef: 'EX-PRUNING' },
  { shortCode: 'D', name: 'Delta', type: 'Other', categoryRef: 'EX-VET' },
];

const serviceActivityTypes = [
  {
    shortCode: 'LT',
    name: 'Learning Training',
    type: 'Service',
    categoryRef: 'ID-BEE',
    inputTypeRef: 'A',
  },
  {
    shortCode: 'TZ',
    name: 'Tanzania',
    type: 'Training',
    categoryRef: 'EX-VET',
    inputTypeRef: 'D',
  },
  {
    shortCode: 'FS',
    name: 'Financial Services',
    type: 'Service',
    categoryRef: 'EX-PRUNING',
    inputTypeRef: 'C',
  },
];

const supportingServiceActivities = [
  {
    shortCode: 'LT-1',
    operator: 'John Doe',
    categoryTypeRef: 'ID',
    categoryRef: 'ID-BEE',
    inputTypeRef: 'A',
    activityTypeRef: 'LT',
    dateOfService: new Date('2024-01-01'),
  },
  {
    shortCode: 'LT-2',
    operator: 'Jane Doe',
    categoryTypeRef: 'EX',
    categoryRef: 'EX-VET',
    inputTypeRef: 'D',
    activityTypeRef: 'LT',
    dateOfService: new Date('2024-01-01'),
  },
  {
    shortCode: 'FS-1',
    operator: 'Jarvis Doe',
    categoryTypeRef: 'EX',
    categoryRef: 'EX-PRUNING',
    inputTypeRef: 'C',
    activityTypeRef: 'FS',
    dateOfService: new Date('2024-01-01'),
  },
];

const serviceActivityBeneficiaries = [
  {
    activityRef: 'LT-1',
    personRef: 'FARM-1',
  },
  {
    activityRef: 'LT-2',
    personRef: 'FARM-2',
  },
  {
    activityRef: 'FS-1',
    personRef: 'FARM-3',
  },
];

export const seedServices = async (
  prisma: PrismaClient,
  locations,
  organisation: string,
) => {
  const persons = await prisma.person.findMany();
  await prisma.supportingServiceCategoryType.createMany({
    data: serviceCategoryTypes.map((type) => ({ ...type, organisation })),
  });
  const types = await prisma.supportingServiceCategoryType.findMany();

  const categoriesWithConnects = serviceCategories.map((category) => {
    const { type, ...rest } = category;
    return {
      ...rest,
      supportingServiceCategoryTypeId: types.find(
        (existingType) => existingType.shortCode === type,
      ).id,
      organisation,
      description: rest.name + ' description',
    };
  });
  await prisma.supportingServiceCategory.createMany({
    data: categoriesWithConnects,
  });
  const categories = await prisma.supportingServiceCategory.findMany();

  const inputTypesWithConnects = serviceInputTypes.map((inputType) => {
    const { categoryRef, ...rest } = inputType;
    return {
      ...rest,
      organisation,
      supportingServiceCategoryId: categories.find(
        (existingCategory) => existingCategory.shortCode === categoryRef,
      ).id,
    };
  });
  await prisma.supportingServiceInputType.createMany({
    data: inputTypesWithConnects,
  });
  const inputTypes = await prisma.supportingServiceInputType.findMany();

  const activityTypesWithConnects = serviceActivityTypes.map((activityType) => {
    const { categoryRef, inputTypeRef, ...rest } = activityType;
    return {
      ...rest,
      organisation,
      supportingServiceCategoryId: categories.find(
        (existingCategory) => existingCategory.shortCode === categoryRef,
      ).id,
      supportingServiceInputTypeId: inputTypes.find(
        (existingInputType) => existingInputType.shortCode === inputTypeRef,
      ).id,
    };
  });
  await prisma.supportingServiceActivityType.createMany({
    data: activityTypesWithConnects,
  });
  const activityTypes = await prisma.supportingServiceActivityType.findMany();

  const activitiesWithConnects = supportingServiceActivities.map((activity) => {
    const {
      categoryTypeRef,
      activityTypeRef,
      categoryRef,
      inputTypeRef,
      ...rest
    } = activity;

    return {
      ...rest,
      organisation,
      locationId: locations ? locations[0].id : null,
      beneficiaryType: 'individual',
      supportingServiceCategoryTypeId: types.find(
        (existingType) => existingType.shortCode === categoryTypeRef,
      ).id,
      supportingServiceActivityTypeId: activityTypes.find(
        (existingActivityType) =>
          existingActivityType.shortCode === activityTypeRef,
      ).id,
      supportingServiceCategoryId: categories.find(
        (existingCategory) => existingCategory.shortCode === categoryRef,
      ).id,
      supportingServiceInputTypeId: inputTypes.find(
        (existingInputType) => existingInputType.shortCode === inputTypeRef,
      ).id,
    };
  });
  await prisma.supportingServiceActivity.createMany({
    data: activitiesWithConnects,
  });
  const activities = await prisma.supportingServiceActivity.findMany();

  const activityBeneficiariesWithConnects = serviceActivityBeneficiaries.map(
    (activityBeneficiaries) => {
      const { activityRef, personRef, ...rest } = activityBeneficiaries;
      return {
        ...rest,
        supportingServiceActivityId: activities.find(
          (existingActivity) => existingActivity.shortCode === activityRef,
        ).id,
        personId: persons.find(
          (existingPerson) => existingPerson.shortCode === personRef,
        ).id,
      };
    },
  );
  await prisma.serviceActivityBeneficiaries.createMany({
    data: activityBeneficiariesWithConnects,
  });
};
