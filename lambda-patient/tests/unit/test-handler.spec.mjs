'use strict';

import { handler } from '../../index.mjs';
import { expect } from 'chai';

describe('Tests index', function () {
    it('verifies successful response', async () => {
        let event = {
            httpMethod: "POST",
            patient: {
                username: "test",
                birthYear:1992,
                name: "Abrar",
                email: "eng.baro@gmail.com",
                address: "almansour",
                paymentMethod: "cash",
                gender: "female",
                phone: "9647702990432",
                cognitoId: "2126bed3-d91d-4cd5-a5f2-fd8e3c0da364"
            }
        }, context;
        const result = await handler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.message).to.be.equal("hello world");
    });
});
