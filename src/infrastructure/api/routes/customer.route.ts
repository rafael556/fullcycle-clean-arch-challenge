import express, {Request, Response} from 'express'
import CustomerCreateUseCase from '../../../usecase/customer/create/create.customer.usecase';
import CustomerRepository from '../../customer/repository/sequelize/customer.repository';
import { InputCreateCustomerDto } from '../../../usecase/customer/create/create.customer.dto';
import ListCustomerUseCase from '../../../usecase/customer/list/list.customer.usecase';
import CustomerPresenter from '../presenters/customer.presenter';

export const customerRoute = express.Router();

customerRoute.post('/', async (req: Request, res: Response) => {
    const usecase = new CustomerCreateUseCase(new CustomerRepository());
    try {
        const customerDto: InputCreateCustomerDto = {
            name: req.body.name,
            address: {
                street: req.body.address.street,
                number: req.body.address.number,
                zip: req.body.address.zip,
                city: req.body.address.city,
            }
        }

        const output = await usecase.execute(customerDto);
        res.send(output);
    } catch(er) {
        res.status(500).send(er)
    }
})

customerRoute.get('/', async (req: Request, res: Response) => {
    const usecase = new ListCustomerUseCase(new CustomerRepository());
    try {
        const output = await usecase.execute({});
        res.format({
            json: async () => res.send(output),
            xml: async () => res.send(CustomerPresenter.listXML(output))
        })
    } catch(error) {
        res.status(500).send(error);
    }
})