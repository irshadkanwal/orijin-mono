"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "seedUsers", {
    enumerable: true,
    get: function() {
        return seedUsers;
    }
});
const seedUsers = async (prisma)=>{
    await prisma.user.deleteMany();
    await prisma.post.deleteMany();
    console.log('Seeding...');
    const user1 = await prisma.user.create({
        data: {
            email: 'lisa@simpson.com',
            firstname: 'Lisa',
            lastname: 'Simpson',
            password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm',
            role: 'USER',
            posts: {
                create: {
                    title: 'Join us for Prisma Day 2019 in Berlin',
                    content: 'https://www.prisma.io/day/',
                    published: true
                }
            }
        }
    });
    const user2 = await prisma.user.create({
        data: {
            email: 'bart@simpson.com',
            firstname: 'Bart',
            lastname: 'Simpson',
            role: 'ADMIN',
            password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm',
            posts: {
                create: [
                    {
                        title: 'Subscribe to GraphQL Weekly for community news',
                        content: 'https://graphqlweekly.com/',
                        published: true
                    },
                    {
                        title: 'Follow Prisma on Twitter',
                        content: 'https://twitter.com/prisma',
                        published: false
                    }
                ]
            }
        }
    });
    return {
        user1,
        user2
    };
};
