import request from 'supertest'
import {app, sequelize} from '../express'

describe('E2E for products', () => {
    beforeEach(async () => {
        await sequelize.sync({force: true})
    })

    afterAll(async() => {
        await sequelize.close();
    })

    it('should create a product', async() => {
        const response = await request(app).post('/product').send({
            name: 'product 1',
            price: 10
        })

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('product 1')
        expect(response.body.price).toBe(10)
    })

    it('should not create a product', async() => {
        const response = await request(app).post('/product').send({
            name: 'product 1'
        })

        expect(response.status).toBe(500);
    })

    it('should list all products', async() => {
        const response = await request(app).post('/product').send({
            name: 'product 1',
            price: 10
        })

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('product 1')

        const response2 = await request(app).post('/product').send({
            name: 'product 2',
            price: 10
        })

        expect(response2.status).toBe(200);
        expect(response2.body.name).toBe('product 2')

        const listResponse = await request(app).get('/product').send();

        expect(listResponse.status).toBe(200);
        expect(listResponse.body.products.length).toBe(2);

        const product1 = listResponse.body.products[0];
        const product2 = listResponse.body.products[1];

        expect(product1.name).toBe('product 1')
        expect(product1.price).toBe(10)

        expect(product2.name).toBe('product 2')
        expect(product2.price).toBe(10)
    })
})