import {
  InputCreateProductDto,
  OutputCreateProductDto,
} from "./create.product.dto";
import CreateProductUseCase from "./create.product.usecase";

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("unit test for create product use case", () => {
  it("should create product", async () => {
    const productRepository = MockRepository();
    const useCase = new CreateProductUseCase(productRepository);

    const input: InputCreateProductDto = {
        name: "product 1",
        price: 10,
      };

    const result: OutputCreateProductDto = await useCase.execute(input);
    expect(result).toEqual({
      id: expect.any(String),
      name: "product 1",
      price: 10,
    });
  });

  it("should throw an error when name is not provided", async () => {
    const productRepository = MockRepository();
    const useCase = new CreateProductUseCase(productRepository);

    const input: InputCreateProductDto = {
        name: "",
        price: 10,
      };

    expect(async () => {
      const result: OutputCreateProductDto = await useCase.execute(input);
    }).rejects.toThrow("Name is required");
  });

  it("should throw an error when price is invalid", async () => {
    const productRepository = MockRepository();
    const useCase = new CreateProductUseCase(productRepository);

    const input: InputCreateProductDto = {
        name: "product 1",
        price: -3,
      };

    expect(async () => {
      const result: OutputCreateProductDto = await useCase.execute(input);
    }).rejects.toThrow("Price should be greater than zero");
  });
});
