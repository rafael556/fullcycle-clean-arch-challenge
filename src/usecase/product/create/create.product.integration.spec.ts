import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import { InputCreateProductDto, OutputCreateProductDto } from "./create.product.dto";
import CreateProductUseCase from "./create.product.usecase";

describe("Integration test for create product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const productRepository = new ProductRepository();
    const useCase = new CreateProductUseCase(productRepository);

    const input: InputCreateProductDto = {
      name: "product 1",
      price: 10,
    };

    const output: OutputCreateProductDto = await useCase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: "product 1",
      price: 10,
    });
  });
});
