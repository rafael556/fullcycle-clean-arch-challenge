import Product from "../../../domain/product/entity/product";
import { InputFindProductDto, OutputFindProductDto } from "./find.product.dto";
import FindProductUseCase from "./find.product.usecase";

const product = new Product("123", "product 1", 10);

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}

describe('Find product unit test use case', () => {

    it('should find a product', async() => {
        const productRepository = MockRepository();
        const useCase = new FindProductUseCase(productRepository);
    
        const input: InputFindProductDto = {
          id: "123",
        };
    
        const output: OutputFindProductDto = {
          id: "123",
          name: "product 1",
          price: 10,
        };
    
        const result = await useCase.execute(input);
        expect(result).toStrictEqual(output);
    })

    it('should not find a product', async() => {
        const productRepository = MockRepository();
        const useCase = new FindProductUseCase(productRepository);
    

        productRepository.find.mockImplementation(() => {
          throw new Error('Product not found');
        })

        const input: InputFindProductDto = {
            id: "123",
          };
    
        expect(() => {
          return useCase.execute(input);
        }).rejects.toThrow("Product not found")
      })
})