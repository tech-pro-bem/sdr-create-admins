import "dotenv/config";
import Interval, { io } from "@interval/sdk/dist/experimental";
import { PrismaClient } from "@prisma/client";
import { generate } from "generate-password";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";

const prisma = new PrismaClient();

const interval = new Interval({
  apiKey: process.env.INTERVAL_KEY,
  routes: {
    create_admin_volunteers: {
      handler: async () => {
        const name = await io.input.text("Qual o nome do voluntário?");
        const email = await io.input.email(
          "Qual o e-mail do admin voluntário?"
        );
        const password = generate({
          length: 12,
          excludeSimilarCharacters: true,
          symbols: true,
        });

        await prisma.admins.create({
          data: {
            email: email,
            passwordHash: await hash(password, 10),
            id: uuidV4(),
            name: name,
            permissionLevel: "1",
            updatedAt: new Date(),
            createdAt: new Date(),
          },
        });

        return `E-mail: ${email}\nSenha: ${password}.\nGuarde essas credenciais em um local seguro!`;
      },
      name: "Criar um admin voluntário",
    },
  },
});

interval.listen();
