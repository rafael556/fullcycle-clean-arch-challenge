import {app, sequelize} from '../express'
import request from 'supertest'

describe('E2E for customer', () => {

    beforeEach(async () => {
        await sequelize.sync({force: true})
    })

    afterAll(async() => {
        await sequelize.close();
    })

    it('should create a customer', async () => {
        const response = await request(app).post('/customer').send({
            name: 'john',
            address: {
                street: 'st',
                city: 'city',
                number: 123,
                zip: '123'
            }
        })

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('john')
        expect(response.body.address.street).toBe('st')
        expect(response.body.address.city).toBe('city')
        expect(response.body.address.number).toBe(123)
        expect(response.body.address.zip).toBe('123')
    })

    it('should not create a customer', async () => {
        const response = await request(app).post('/customer').send({
            name: 'john'
        })

        expect(response.status).toBe(500);
    })

    it('should list all customer', async() => {
        const response = await request(app).post('/customer').send({
            name: 'john',
            address: {
                street: 'st',
                city: 'city',
                number: 123,
                zip: '123'
            }
        })

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('john')

        const response2 = await request(app).post('/customer').send({
            name: 'jane',
            address: {
                street: 'st 2',
                city: 'city 2',
                number: 1234,
                zip: '1234'
            }
        })

        expect(response2.status).toBe(200);
        expect(response2.body.name).toBe('jane')

        const listResponse = await request(app).get('/customer').send();
        expect(listResponse.status).toBe(200);
        expect(listResponse.body.customers.length).toBe(2)

        const customer1 = listResponse.body.customers[0];
        const customer2 = listResponse.body.customers[1];

        expect(customer1.name).toBe('john')
        expect(customer1.address.street).toBe('st')
        expect(customer1.address.city).toBe('city')
        expect(customer1.address.number).toBe(123)
        expect(customer1.address.zip).toBe('123')

        expect(customer2.name).toBe('jane')
        expect(customer2.address.street).toBe('st 2')
        expect(customer2.address.city).toBe('city 2')
        expect(customer2.address.number).toBe(1234)
        expect(customer2.address.zip).toBe('1234')

        const listResponseXML = await request(app)
        .get('/customer')
        .set('Accept', 'application/xml')
        .send();

        expect(listResponseXML.status).toBe(200);
        expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`)
    })
})