import Product from "../../../domain/product/entity/product";
import {
  InputUpdateProductDto,
  OutputUpdateProductDto,
} from "./update.product.dto";
import UpdateProductUseCase from "./update.product.usecase";

const product = new Product("123", "product 1", 10);

const MockRepository = () => {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    update: jest.fn(),
  };
};

describe("unit test for update product use case", () => {
  it("should update a product", async () => {
    const productRepository = MockRepository();
    const useCase = new UpdateProductUseCase(productRepository);

    const input: InputUpdateProductDto = {
      id: "123",
      name: "product 2",
      price: 100,
    };

    const output: OutputUpdateProductDto = await useCase.execute(input);
    expect(output).toEqual(input);
  });
});
