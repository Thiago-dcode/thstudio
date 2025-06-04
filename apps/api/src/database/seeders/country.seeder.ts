import { EnumLanguage, PrismaClient } from '../generated/prisma';

export const countrySeeder = async (prisma: PrismaClient) => {
  const COUNTRIES: {
    code: string;
    name: string;
    translations: {
      code: EnumLanguage;
      name: string;
    }[];
  }[] = [
    {
      code: 'US',
      name: 'United States',
      translations: [
        {
          code: 'EN',
          name: 'United States',
        },
        {
          code: 'ES',
          name: 'Estados Unidos',
        },
        {
          code: 'BR',
          name: 'Estados Unidos',
        },
      ],
    },
    {
      code: 'CA',
      name: 'Canada',
      translations: [
        {
          code: 'EN',
          name: 'Canada',
        },
        {
          code: 'ES',
          name: 'Canadá',
        },
        {
          code: 'BR',
          name: 'Canadá',
        },
      ],
    },
    {
      code: 'MX',
      name: 'Mexico',
      translations: [
        {
          code: 'EN',
          name: 'Mexico',
        },
        {
          code: 'ES',
          name: 'México',
        },
        {
          code: 'BR',
          name: 'México',
        },
      ],
    },
    {
      code: 'ES',
      name: 'Spain',
      translations: [
        {
          code: 'EN',
          name: 'Spain',
        },
        {
          code: 'ES',
          name: 'España',
        },
        {
          code: 'BR',
          name: 'Espanha',
        },
      ],
    },
    {
      code: 'FR',
      name: 'France',
      translations: [
        {
          code: 'EN',
          name: 'France',
        },
        {
          code: 'ES',
          name: 'Francia',
        },
        {
          code: 'BR',
          name: 'França',
        },
      ],
    },
    {
      code: 'DE',
      name: 'Germany',
      translations: [
        {
          code: 'EN',
          name: 'Germany',
        },
        {
          code: 'ES',
          name: 'Alemania',
        },
        {
          code: 'BR',
          name: 'Alemanha',
        },
      ],
    },
    {
      code: 'IT',
      name: 'Italy',
      translations: [
        {
          code: 'EN',
          name: 'Italy',
        },
        {
          code: 'ES',
          name: 'Italia',
        },
        {
          code: 'BR',
          name: 'Itália',
        },
      ],
    },
    {
      code: 'PT',
      name: 'Portugal',
      translations: [
        {
          code: 'EN',
          name: 'Portugal',
        },
        {
          code: 'ES',
          name: 'Portugal',
        },
        {
          code: 'BR',
          name: 'Portugal',
        },
      ],
    },
    {
      code: 'GB',
      name: 'United Kingdom',
      translations: [
        {
          code: 'EN',
          name: 'United Kingdom',
        },
        {
          code: 'ES',
          name: 'Reino Unido',
        },
        {
          code: 'BR',
          name: 'Reino Unido',
        },
      ],
    },
    {
      code: 'AU',
      name: 'Australia',
      translations: [
        {
          code: 'EN',
          name: 'Australia',
        },
        {
          code: 'ES',
          name: 'Australia',
        },
        {
          code: 'BR',
          name: 'Austrália',
        },
      ],
    },
    {
      code: 'BR',
      name: 'Brazil',
      translations: [
        {
          code: 'EN',
          name: 'Brazil',
        },
        {
          code: 'ES',
          name: 'Brasil',
        },
        {
          code: 'BR',
          name: 'Brasil',
        },
      ],
    },
    {
      code: 'CL',
      name: 'Chile',
      translations: [
        {
          code: 'EN',
          name: 'Chile',
        },
        {
          code: 'ES',
          name: 'Chile',
        },
        {
          code: 'BR',
          name: 'Chile',
        },
      ],
    },
    {
      code: 'CO',
      name: 'Colombia',
      translations: [
        {
          code: 'EN',
          name: 'Colombia',
        },
        {
          code: 'ES',
          name: 'Colombia',
        },
        {
          code: 'BR',
          name: 'Colômbia',
        },
      ],
    },
    {
      code: 'PE',
      name: 'Peru',
      translations: [
        {
          code: 'EN',
          name: 'Peru',
        },
        {
          code: 'ES',
          name: 'Peru',
        },
        {
          code: 'BR',
          name: 'Peru',
        },
      ],
    },
    {
      code: 'UY',
      name: 'Uruguay',
      translations: [
        {
          code: 'EN',
          name: 'Uruguay',
        },
        {
          code: 'ES',
          name: 'Uruguay',
        },
        {
          code: 'BR',
          name: 'Uruguai',
        },
      ],
    },
  ];

  await prisma.country.deleteMany();
  await prisma.country.createMany({
    data: COUNTRIES.map(({ code, name, translations }, index) => ({
      id: index + 1,
      code,
      name,
    })),
  });

  await prisma.countryTranslation.deleteMany();
  let countryId = 1;
  for (const country of COUNTRIES) {
    await prisma.countryTranslation.createMany({
      data: country.translations.map(({ code, name }) => ({
        languageCode: code,
        countryId: countryId,
        name,
      })),
    });
    countryId++;
  }
};
