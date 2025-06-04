import { EnumLanguage, PrismaClient } from '../generated/prisma';

export const languageSeeder = async (prisma: PrismaClient) => {
  const LANGUAGES_CODES: {
    code: EnumLanguage;
    name: string;
    translations: {
      code: EnumLanguage;
      name: string;
    }[];
  }[] = [
    {
      code: 'EN',
      name: 'English',
      translations: [
        {
          code: 'EN',
          name: 'English',
        },
        {
          code: 'ES',
          name: 'Inglés',
        },
        {
          code: 'BR',
          name: 'Inglês',
        },
      ],
    },
    {
      code: 'ES',
      name: 'Spanish',

      translations: [
        {
          code: 'EN',
          name: 'Spanish',
        },
        {
          code: 'ES',
          name: 'Español',
        },
        {
          code: 'BR',
          name: 'Espanhol',
        },
      ],
    },
    {
      code: 'BR',
      name: 'Brazilian Portuguese',
      translations: [
        {
          code: 'EN',
          name: 'Brazilian Portuguese',
        },
        {
          code: 'ES',
          name: 'Portugués brasileño',
        },
        {
          code: 'BR',
          name: 'Português brasileiro',
        },
      ],
    },
  ];
  await prisma.language.deleteMany();
  await prisma.language.createMany({
    data: LANGUAGES_CODES.map(({ code, name, translations }) => ({
      name,
      code,
      isDefault: code === 'ES',
    })),
  });

  await prisma.languageTranslation.deleteMany();
  for (const language of LANGUAGES_CODES) {
    for (const translation of language.translations) {
      await prisma.languageTranslation.create({
        data: {
          name: translation.name,
          languageCode: translation.code,
        },
      });
    }
  }
};
