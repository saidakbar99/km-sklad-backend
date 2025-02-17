import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const demand = async (req, res) => {
  try {
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
  } catch (error) {
    console.log('Server error: ', error)
    res.status(500).json({ error: 'Server error' });
  }
};

export const demandFurniture = async (req, res) => {
  try {
    const { demandId } = req.body;
    const furnitures = await prisma.demand_furniture.findMany({ where: { demand_id: demandId } });
  
    res.json({ furnitures });
  } catch (error) {
    console.log('Server error: ', error)
    res.status(500).json({ error: 'Server error' });
  }
}

export const furniture = async (req, res) => {
  try {
    const { furnitureId } = req.body;
    const furniture = await prisma.furniture.findFirst({ where: { id: furnitureId } });

    res.json({ furniture });
  } catch (error) {
    console.log('Server error: ', error)
    res.status(500).json({ error: 'Server error' });
  }
}

export const categoryFurniture = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const category = await prisma.category_furniture.findFirst({ where: { id: categoryId } });

    res.json({ category });
  } catch (error) {
    console.log('Server error: ', error)
    res.status(500).json({ error: 'Server error' });
  }
}

export const setFurniture = async (req, res) => {
  try {
    const { furnitureId } = req.body;
    const category = await prisma.komplekt_furniture.findFirst({ where: { furniture_id: furnitureId } });
    const setId = category.komplekt_id
    const set = await prisma.komplekt.findFirst({ where: { id: setId } })

    res.json({ set });
  } catch (error) {
    console.log('Server error: ', error)
    res.status(500).json({ error: 'Server error' });
  }
}

export const unique = async (req, res) => {
  try {
    const { packageQuantity, uniqueId } = req.body;
    await prisma.unique.update({
      where: { id: uniqueId },
      data: { package_quantity: packageQuantity }
    })

    res.json({ message: 'Package quantity updated' });
  } catch (error) {
    console.log('Server error: ', error)
    res.status(500).json({ error: 'Server error' });
  }
}

export const vipusk = async (req, res) => {
  try {
    const { furnitureId, uniqueId, amount, date, demandFurnitureId, sehId } = req.body

    await prisma.vipusk.create({
      data: {
        furniture_id: furnitureId,
        unique_id: uniqueId,
        demand_furniture_id: demandFurnitureId,
        amount: amount,
        date: date,
        seh_id: sehId
      }
    })

    res.json({ message: 'Serial generated' });
  } catch (error) {
    console.log('Server error: ', error)
    res.status(500).json({ error: 'Server error' });
  }
}

export const getSerials = async (req, res) => {
  try {
    const { sehId } = req.body
    const serials = await prisma.vipusk.findMany({ 
      where: {
        date: {
          gte: new Date("2025-01-01T00:00:00.000Z"),
        },
        seh_id: sehId
      },
      orderBy: {
        id: 'desc'
      },
      take: 50,
      include: {
        furniture: {
          select: {
            name: true,
            category_furniture: {
              select: {
                name: true
              }
            },
            komplekt_furniture: {
              select: {
                komplekt: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        },
        unique: {
          select: {
            name: true,
            color: {
              select: {
                name: true
              }
            }
          }
        },
        demand_furniture: {
          select: {
            demand: {
              select: {
                doc_no: true,
                customer: {
                  select: {
                    name: true
                  }
                }
              }
            },
            color: {
              select: {
                name: true
              }
            }
          }
        },
      }
    })
    
    res.json({ serials })
  } catch (error) {
    console.log('Server error: ', error)
    res.status(500).json({ error: 'Server error' });
  }
}

export const getAllFurnitureCategories = async (req, res) => {
  try {
    const categories = await prisma.category_furniture.findMany({
      where: { active: true },
      orderBy: { sorder: 'asc' },
    })

    res.json({ categories })
  } catch (error) {
    console.log('Server error: ', error)
    res.status(500).json({ error: 'Server error' });
  }
}

export const getFurnitureSets = async (req, res) => {
  try {
    const { categoryId } = req.body
    const sets = await prisma.komplekt.findMany({
      where: {
        category_id: categoryId
      }
    })

    res.json({ sets })
  } catch (error) {
    console.log('Server error: ', error)
    res.status(500).json({ error: 'Server error' });
  }
}

export const getFurnitures = async (req, res) => {
  try {
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
  } catch (error) {
    console.log('Server error: ', error)
    res.status(500).json({ error: 'Server error' });
  }
}

export const getColors = async (req, res) => {
  try {
    const colors = await prisma.color.findMany({
      where: { checked: 1 },
      orderBy: { sorder: 'asc' },
    })

    res.json({colors})
  } catch (error) {
    console.log('Server error: ', error)
    res.status(500).json({ error: 'Server error' });
  }
}

export const getTrees = async (req, res) => {
  try {
    const trees = await prisma.tree.findMany()
    res.json({ trees })
  } catch (error) {
    console.log('Server error: ', error)
    res.status(500).json({ error: 'Server error' });
  }
}

const generateUniqueSPName = async () => {
  try {
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
  } catch (error) {
    console.log('Server error: ', error)
    res.status(500).json({ error: 'Server error' });
  }
};

export const createSupermarketSerial = async (req, res) => {
  try {
    const { 
      treeId, 
      colorId, 
      positionId, 
      furnitureId, 
      amount, 
      date, 
      sehId 
    } = req.body
    const name = await generateUniqueSPName();

    const unique = await prisma.unique.create({
      data: {
        name: name,
        tree_id: treeId,
        color_id: colorId,
        position_id: positionId,
        furniture_id: furnitureId,
        amount: amount
      }
    })

    await prisma.vipusk.create({
      data: {
        furniture_id: furnitureId,
        unique_id: unique.id,
        demand_furniture_id: null,
        amount: amount,
        date: date,
        seh_id: sehId
      }
    })

    res.json({ message: 'Serial generated'})
  } catch (error) {
    console.log('Server error: ', error)
    res.status(500).json({ error: 'Server error' });
  }
}

export const getLastInvoiceNumber = async (req, res) => {
  try {
    const lastInvoiceId = await prisma.vipusk_nakladnoy.findFirst({
      orderBy: { id: 'desc' },
      select: { id: true },
    });

    res.json({ lastInvoiceId })
  } catch (error) {
    console.log('Server error: ', error)
    res.status(500).json({ error: 'Server error' });
  }
}

export const createInvoice = async (req, res) => {
  try {
    const {
      sehId,
      date,
      uniqueIds
    } = req.body

    const nakladnoy = await prisma.vipusk_nakladnoy.create({
      data: {
        date: date,
        seh_id: sehId
      }
    })

    await prisma.vipusk_nakladnoy_unique.createMany({
      data: uniqueIds.map((unique_id) => ({
        unique_id,
        vipusk_nakladnoy_id: nakladnoy.id,
      })),
    })
    

    res.json({ message: 'Vipusk nakladnoy created'})
  } catch (error) {
    console.log('Server error: ', error)
    res.status(500).json({ error: 'Server error' });
  }
}

export const getUserSeh = async (req, res) => {
  try {
    const { sehId } = req.body
    const seh = await prisma.seh.findFirst({
      where: {
        id: parseInt(sehId)
      }
    })

    res.json({ seh })
  } catch (error) {
    console.log('Server error: ', error)
    res.status(500).json({ error: 'Server error' });
  }
}

export const getInvoices = async (req, res) => {
  try {
    const { seh_id } = req.query;

    const whereCondition = {
      ...(seh_id ? { seh_id: Number(seh_id) } : {}),
      recieved: false
    }

    const invoices = await prisma.vipusk_nakladnoy.findMany({
      where: whereCondition,
      include: { 
        unique_entries: true,
        seh: true
      }
    });

    const invoicesWithDemands = await Promise.all(
      invoices.map(async (invoice) => {
        const uniqueIds = invoice.unique_entries.map(entry => entry.unique_id).filter(id => id !== null);

        if (uniqueIds.length === 0) {
          return { id: invoice.id, date: invoice.date, seh_id: invoice.seh_id, seh: invoice.seh.name, demands: ["Supermarket"] };
        }

        const demandFurniture = await prisma.demand_furniture.findMany({
          where: { unique_id: { in: uniqueIds } },
          select: { demand_id: true, unique_id: true }
        });

        const foundUniqueIds = demandFurniture.map(df => df.unique_id);
        const notFoundUniqueIds = uniqueIds.filter(id => !foundUniqueIds.includes(id));

        const demandIds = demandFurniture.map(df => df.demand_id).filter(id => id !== null);

        let demands = [];

        if (demandIds.length > 0) {
          const fetchedDemands = await prisma.demand.findMany({
            where: { id: { in: demandIds } },
            select: { doc_no: true }
          });

          demands = fetchedDemands.map(d => d.doc_no);
        }

        if (notFoundUniqueIds.length > 0) {
          demands.push("Supermarket");
        }

        return { 
          id: invoice.id, 
          date: invoice.date, 
          seh_id: invoice.seh_id, 
          seh: invoice.seh.name,
          demands: demands.length > 0 ? demands : ["Supermarket"] };
      })
    );

    res.json({ invoices: invoicesWithDemands });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.body

    await prisma.vipusk_nakladnoy_unique.deleteMany({
      where: {
        vipusk_nakladnoy_id: invoiceId
      }
    })

    await prisma.vipusk_nakladnoy.delete({
      where: {
        id: invoiceId
      }
    })

    res.json({ message: 'Invoice deleted' })
  } catch (error) {
    console.log('Server error: ', error)
    res.status(500).json({ error: 'Server error' });
  }
}

export const updateInvoice = async (req, res) => {
  try {
    const { invoiceId, sehId, date, uniqueIds } = req.body;

    const updatedInvoice = await prisma.vipusk_nakladnoy.update({
      where: { id: invoiceId },
      data: {
        date: date,
        seh_id: sehId
      }
    });

    await prisma.vipusk_nakladnoy_unique.deleteMany({
      where: { vipusk_nakladnoy_id: invoiceId }
    });

    await prisma.vipusk_nakladnoy_unique.createMany({
      data: uniqueIds.map((unique_id) => ({
        unique_id,
        vipusk_nakladnoy_id: invoiceId,
      })),
    });

    res.json({ message: 'Vipusk nakladnoy updated' });
  } catch (error) {
    console.error('Server error: ', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getOneInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.vipusk_nakladnoy.findUnique({
      where: { id: parseInt(id) },
      include: {
        seh: {
          select: {
            name: true
          }
        }
      }
    });

    const uniqueIds = await prisma.vipusk_nakladnoy_unique.findMany({
      where: {
        vipusk_nakladnoy_id: parseInt(id)
      }
    })

    const ids = uniqueIds.map(item => item.unique_id)

    const uniques = await prisma.unique.findMany({
      where: {
        id: { in: ids },
      }
    })

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.json({
      id: invoice.id,
      date: invoice.date,
      seh: invoice.seh.name,
      seh_id: invoice.seh_id,
      uniques: uniques,
    });
  } catch (error) {
    console.error("Error fetching invoice: ", error);
    res.status(500).json({ error: "Failed to fetch invoice" });
  }
}

export const getAllUniquesOfInvoice = async (req, res) => {
  try {
    const uniques = await prisma.vipusk_nakladnoy_unique.findMany({
      select: {
        unique_id: true
      }
    })

    const uniqueIds = uniques.map(item => item.unique_id)

    res.json({ uniques: uniqueIds });
  } catch (error) {
    console.error("Error fetching invoice: ", error);
    res.status(500).json({ error: "Failed to fetch invoice" });
  }
}

export const recieveInvoice = async (req, res) => {
  try {
    const { invoiceIds } = req.body

    await prisma.vipusk_nakladnoy.updateMany({
      where: { id: { in: invoiceIds } },
      data: { recieved: true }
    });

    await prisma.vipusk_nakladnoy_unique.updateMany({
      where: { vipusk_nakladnoy_id: { in: invoiceIds } },
      data: { recieved: true }
    });

    res.json({ message: 'Invoice recieved' });
  } catch (error) {
    console.error("Error fetching invoice: ", error);
    res.status(500).json({ error: "Failed to fetch invoice" });
  }
}