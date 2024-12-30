import 'dotenv/config'
import { prisma } from '@competition-manager/prisma';
import { CreateCategory$ } from '@competition-manager/schemas';
import catData from './categories.json';

export const fillDB = async () => {
    const categories = await prisma.category.findMany();
    for (const cat of catData) {
        try {
            const category = CreateCategory$.parse(cat);
            const existingCategory = categories.find(c => c.name === category.name);
            if (existingCategory) {
                await prisma.category.update({
                    where: { id: existingCategory.id },
                    data: category
                });
                continue;
            }
            await prisma.category.create({
                data: category
            });
        } catch (error) {
            console.log('Error parsing category', cat);
            console.error(error);
            continue;
        }
    }
    console.log('DB category filled');
}
