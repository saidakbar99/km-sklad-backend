import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const demand = async (req, res) => {
  const { demandNumber } = req.body
  const demands = await prisma.demand.findMany({
    where: {
      taxlil_id: 8,
      doc_no: {
        contains: demandNumber,
      },
    }, 
  });

  res.json({ demands });
};

export const demandFurniture = async (req, res) => {
  const { demandId } = req.body;
  const furnitures = await prisma.demand_furniture.findMany({ where: { demand_id: demandId } });

  res.json({ furnitures });
}

export const furniture = async (req, res) => {
  const { furnitureId } = req.body;
  const furniture = await prisma.furniture.findFirst({ where: { id: furnitureId } });

  res.json({ furniture });
}

export const categoryFurniture = async (req, res) => {
  const { categoryId } = req.body;
  const category = await prisma.category_furniture.findFirst({ where: { id: categoryId } });

  res.json({ category });
}

export const setFurniture = async (req, res) => {
  const { furnitureId } = req.body;
  const category = await prisma.komplekt_furniture.findFirst({ where: { furniture_id: furnitureId } });
  const setId = category.komplekt_id
  const set = await prisma.komplekt.findFirst({ where: { id: setId } })

  res.json({ set });
}

export const unique = async (req, res) => {
  const { packageQuantity, uniqueId } = req.body;
  await prisma.unique.update({
    where: { id: uniqueId },
    data: { package_quantity: packageQuantity }
  })

  res.json({ message: 'Package quantity updated' });
}

export const vipusk = async (req, res) => {
  const { furnitureId, uniqueId, amount, date, demandFurnitureId } = req.body

  await prisma.vipusk.create({
    data: {
      furniture_id: furnitureId,
      unique_id: uniqueId,
      demand_furniture_id: demandFurnitureId,
      amount: amount,
      date: date,
    }
  })

  res.json({ message: 'Serial generated' });
}

export const getSerials = async (req, res) => {
  const serials = await prisma.vipusk.findMany({ 
    where: {
      date: {
        gte: new Date("2024-11-01T00:00:00.000Z"),
      },
    },
    include: {
      furniture: {
        include: {
          category_furniture: true,
          komplekt_furniture: true
        }
      },
      unique: {
        include: {
          color: true
        }
      },
      demand_furniture: {
        include: {
          demand: true,
          furniture: true,
          color: true
        }
      },
    }
  })

  res.json({ serials })
}

export const getAllFurnitureCategories = async (req, res) => {
  const categories = await prisma.category_furniture.findMany({
    where: { active: true },
    orderBy: { sorder: 'asc' },
  })

  res.json({ categories })
}

export const getFurnitureSets = async (req, res) => {
  const { categoryId } = req.body
  const sets = await prisma.komplekt.findMany({
    where: {
      category_id: categoryId
    }
  })

  res.json({ sets })
}

export const getFurnitures = async (req, res) => {
  const { setId } = req.body
  const furnitureIds = await prisma.komplekt_furniture.findMany({
    where: { komplekt_id: setId },
    select: { furniture_id: true }
  });

  const ids = furnitureIds.map(item => item.furniture_id);

  const furnitures = await prisma.furniture.findMany({
    where: {
      id: { in: ids }
    }
  });

  res.json({ furnitures });
}

export const getColors = async (req, res) => {
  const colors = await prisma.color.findMany({
    where: { checked: 1 },
    orderBy: { sorder: 'asc' },
  })

  res.json({colors})
}

export const getTrees = async (req, res) => {
  const trees = await prisma.tree.findMany()
  res.json({ trees })
}

const generateUniqueSPName = async () => {
  const lastEntry = await prisma.unique.findFirst({
    where: { name: { startsWith: "SP" } },
    orderBy: { id: "desc" },
    select: { name: true },
  });

  let nextNumber = 1;
  let currentPadding = 5;

  if (lastEntry?.name) {
    const match = lastEntry.name.match(/^SP(\d+)$/);
    if (match) {
      nextNumber = parseInt(match[1], 10) + 1;
      currentPadding = match[1].length;
    }
  }

  return `SP${nextNumber.toString().padStart(currentPadding, "0")}`;
};

export const createSupermarketSerial = async (req, res) => {
  const { treeId, colorId, positionId, furnitureId, amount, date } = req.body
  const name = await generateUniqueSPName();

  const unique = await prisma.unique.create({
    data: {
      name: name,
      tree_id: treeId,
      color_id: colorId,
      position_id: positionId,
      furniture_id: furnitureId,
      amount: amount,
    }
  })

  await prisma.vipusk.create({
    data: {
      furniture_id: furnitureId,
      unique_id: unique.id,
      demand_furniture_id: null,
      amount: amount,
      date: date
    }
  })

  res.json({ message: 'Serial generated'})
}