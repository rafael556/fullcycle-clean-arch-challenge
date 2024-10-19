import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";
import { InputCreateProductDto, OutputCreateProductDto } from "../create/create.product.dto";
import { InputUpdateProductDto, OutputUpdateProductDto } from "./update.product.dto";
import UpdateProductUseCase from "./update.product.usecase";

describe("integration test for update product use case", () => {
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

  it('should update product', async() => {
    const productRepository = new ProductRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);
    const updateProductUseCase = new UpdateProductUseCase(productRepository);

    const createInput: InputCreateProductDto = {
      name: "product 1",
      price: 10,
    };

    const createOutput: OutputCreateProductDto = await createProductUseCase.execute(createInput);

    const updateInput: InputUpdateProductDto = {
        id: createOutput.id,
        name: 'product 2',
        price: 30,
    }

    const updateOutput: OutputUpdateProductDto = await updateProductUseCase.execute(updateInput);
    expect(updateOutput).toEqual(updateInput);
  })
});
