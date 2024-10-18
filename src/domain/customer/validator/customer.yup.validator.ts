import ValidatorInterface from "../../@shared/validator/validator.interface";
import Customer from "../entity/customer";
import * as yup from 'yup'

export default class CustomerYupValidator implements ValidatorInterface<Customer> {
    validate(entity: Customer): void {
        try {
            yup.object().shape({
                id: yup.string().required("Id is Required"),
                name: yup.string().required("Name is Required"),
            }).validateSync(
                {
                    id: entity.id,
                    name: entity.name
                },
                {
                    abortEarly: false,
                }
            )
        } catch (errors) {
            const e = errors as yup.ValidationError;
            e.errors.forEach((error) => {
                entity.notification.addError({
                    context: "customer",
                    message: error
                })
            })
        }
    }
}