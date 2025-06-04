import { EnumLanguage, EnumMediaType, PrismaClient } from '../generated/prisma';

export const projectStatusSeeder = async (prisma: PrismaClient) => {
  const CATEGORIES: {
    name: string;
    categoryType: EnumMediaType;
    translations: {
      languageCode: EnumLanguage;
      name: string;
    }[];
  }[] = [
    {
      name: 'Landscape',
      categoryType: 'IMAGE',
      translations: [
        {
          languageCode: 'EN',
          name: 'Landscape',
        },
        {
          languageCode: 'ES',
          name: 'Paisaje',
        },
        {
          languageCode: 'BR',
          name: 'Paisagem',
        },
      ],
    },
    {
      name: 'Portrait',
      categoryType: 'IMAGE',
      translations: [
        {
          languageCode: 'EN',
          name: 'Portrait',
        },
        {
          languageCode: 'ES',
          name: 'Retrato',
        },
        {
          languageCode: 'BR',
          name: 'Retrato',
        },
      ],
    },
    {
      name: 'Adventure',
      categoryType: 'IMAGE',
      translations: [
        {
          languageCode: 'EN',
          name: 'Adventure',
        },
        {
          languageCode: 'ES',
          name: 'Aventura',
        },
        {
          languageCode: 'BR',
          name: 'Aventura',
        },
      ],
    },
    {
      name: 'Nature',
      categoryType: 'IMAGE',
      translations: [
        {
          languageCode: 'EN',
          name: 'Nature',
        },
        {
          languageCode: 'ES',
          name: 'Naturaleza',
        },
        {
          languageCode: 'BR',
          name: 'Natura',
        },
      ],
    },

    {
      name: 'Architecture',
      categoryType: 'IMAGE',
      translations: [
        {
          languageCode: 'EN',
          name: 'Architecture',
        },
        {
          languageCode: 'ES',
          name: 'Arquitectura',
        },
        {
          languageCode: 'BR',
          name: 'Arquitetura',
        },
      ],
    },
    {
      name: 'Street Photography',
      categoryType: 'IMAGE',
      translations: [
        {
          languageCode: 'EN',
          name: 'Street Photography',
        },
        {
          languageCode: 'ES',
          name: 'Fotografía de calle',
        },
        {
          languageCode: 'BR',
          name: 'Fotografia de rua',
        },
      ],
    },
    {
      name: 'Brutalism',
      categoryType: 'IMAGE',
      translations: [
        {
          languageCode: 'EN',
          name: 'Brutalism',
        },
        {
          languageCode: 'ES',
          name: 'Brutalismo',
        },
        {
          languageCode: 'BR',
          name: 'Brutalismo',
        },
      ],
    },
    {
      name: 'Aerial',
      categoryType: 'IMAGE',
      translations: [
        {
          languageCode: 'EN',
          name: 'Aerial',
        },
        {
          languageCode: 'ES',
          name: 'Aérea',
        },
        {
          languageCode: 'BR',
          name: 'Aérea',
        },
      ],
    },
    {
      name: 'Macro',
      categoryType: 'IMAGE',
      translations: [
        {
          languageCode: 'EN',
          name: 'Macro',
        },
        {
          languageCode: 'ES',
          name: 'Macro',
        },
        {
          languageCode: 'BR',
          name: 'Macro',
        },
      ],
    },
    {
      name: 'Night',
      categoryType: 'IMAGE',
      translations: [
        {
          languageCode: 'EN',
          name: 'Night',
        },
        {
          languageCode: 'ES',
          name: 'Nocturna',
        },
        {
          languageCode: 'BR',
          name: 'Noite',
        },
      ],
    },
    {
      name: 'Fauna',
      categoryType: 'IMAGE',
      translations: [
        {
          languageCode: 'EN',
          name: 'Fauna',
        },
        {
          languageCode: 'ES',
          name: 'Fauna',
        },
        {
          languageCode: 'BR',
          name: 'Fauna',
        },
      ],
    },
    {
      name: 'Flora',
      categoryType: 'IMAGE',
      translations: [
        {
          languageCode: 'EN',
          name: 'Flora',
        },
        {
          languageCode: 'ES',
          name: 'Flora',
        },
        {
          languageCode: 'BR',
          name: 'Flora',
        },
      ],
    },
    //VIDEO

    {
      name: 'Documentary',
      categoryType: 'VIDEO',
      translations: [
        {
          languageCode: 'EN',
          name: 'Documentary',
        },
        {
          languageCode: 'ES',
          name: 'Documental',
        },
        {
          languageCode: 'BR',
          name: 'Documental',
        },
      ],
    },
    {
      name: 'Commercial',
      categoryType: 'VIDEO',
      translations: [
        {
          languageCode: 'EN',
          name: 'Commercial',
        },
        {
          languageCode: 'ES',
          name: 'Comercial',
        },
        {
          languageCode: 'BR',
          name: 'Comercial',
        },
      ],
    },
    {
      name: 'Cinematography',
      categoryType: 'VIDEO',
      translations: [
        {
          languageCode: 'EN',
          name: 'Cinematography',
        },
        {
          languageCode: 'ES',
          name: 'Cinematografía',
        },
        {
          languageCode: 'BR',
          name: 'Cinematografia',
        },
      ],
    },
    {
      name: 'Music Video',
      categoryType: 'VIDEO',
      translations: [
        {
          languageCode: 'EN',
          name: 'Music Video',
        },
        {
          languageCode: 'ES',
          name: 'Video musical',
        },
        {
          languageCode: 'BR',
          name: 'Vídeo musical',
        },
      ],
    },
    {
      name: 'Travel',
      categoryType: 'VIDEO',
      translations: [
        {
          languageCode: 'EN',
          name: 'Travel',
        },
        {
          languageCode: 'ES',
          name: 'Viajes',
        },
        {
          languageCode: 'BR',
          name: 'Viagens',
        },
      ],
    },
    {
      name: 'Wedding',
      categoryType: 'VIDEO',
      translations: [
        {
          languageCode: 'EN',
          name: 'Wedding',
        },
        {
          languageCode: 'ES',
          name: 'Bodas',
        },
        {
          languageCode: 'BR',
          name: 'Casamentos',
        },
      ],
    },
    {
      name: 'Small Business',
      categoryType: 'VIDEO',
      translations: [
        {
          languageCode: 'EN',
          name: 'Small Business',
        },
        {
          languageCode: 'ES',
          name: 'Pequeño negocio',
        },
        {
          languageCode: 'BR',
          name: 'Pequeno negócio',
        },
      ],
    },
    {
      name: 'Product',
      categoryType: 'VIDEO',
      translations: [
        {
          languageCode: 'EN',
          name: 'Product',
        },
        {
          languageCode: 'ES',
          name: 'Producto',
        },
        {
          languageCode: 'BR',
          name: 'Produto',
        },
      ],
    },
  ];

  await prisma.mediaCategory.deleteMany();
  await prisma.mediaCategory.createMany({
    data: CATEGORIES.map(({ name, categoryType }, index) => ({
      id: index + 1,
      name,
      categoryType,
    })),
  });

  await prisma.mediaCategoryTranslation.deleteMany();
  let categoryId = 1;
  for (const category of CATEGORIES) {
    await prisma.mediaCategoryTranslation.createMany({
      data: category.translations.map(({ languageCode, name }) => ({
        languageCode,
        name,
        mediaCategoryId: categoryId,
      })),
    });
    categoryId++;
  }
};
