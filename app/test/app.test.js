let request = require('supertest');
let chai = require('chai');
let app = require('../../index');

let expect = chai.expect;

let business_account;
let dept_account;

let getBusinessId = async () => {
    let result = await request(app).post('/api/v1/auth/sign_up').send({
        username: 'test_business',
        password: 'password123',
        business_name: 'Chisco Enterprises',
        user_type: 'BUSINESS_OWNER'
    });

    return result._id;
}

let get_token = async () => {
    await request(app).post('/api/v1/auth/sign_up').send({
        username: 'test_lead',
        password: 'password123',
        business_name: 'Chisco Enterprises',
        department_name: 'Admin Department',
        user_type: 'DEPARTMENT_HEAD'
    });

    // Login and get the token
    let dept_user_res = await request(app).post('/api/v1/auth/sign_in').send({
        username: 'test_lead',
        password: 'password123'
    });

    await request(app).post('/api/v1/auth/sign_up').send({
        username: 'test_business',
        password: 'password123',
        business_name: 'Chisco Enterprises',
        user_type: 'BUSINESS_OWNER'
    });

    let biz_user_res = await request(app).post('/api/v1/auth/sign_in').send({
        username: 'test_business',
        password: 'password123'
    });

    dept_account = dept_user_res.body.data;
    business_account = biz_user_res.body.data;
};

describe('Order API', () => {
    before(async () => { //Before each test we empty the database.
        await global.Models.UserModel.deleteMany({});

        await global.Models.TransactionModel.deleteMany({});

        await global.Models.BusinessUserModel.deleteMany({});

        await global.Models.OrderModel.destroy({
            where: {},
            truncate: true
        });
    });

    before(async () => {
        // Get auth token.
        await get_token();
    });

    it('should create a new order', async () => {
        console.log("dept_account:", dept_account);
        const res = await request(app)
            .post('/api/v1/orders')
            .set('Authorization', `Bearer ${dept_account}`)
            .send({
                business_id: getBusinessId(),
                amount: 1000
            });

        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('status');
    });
});

describe('Authentication API', () => {

    it('should register a new department lead', async () => {
        let dep_res = await request(app)
            .post('/api/v1/auth/sign_up')
            .send({
                username: 'test_lead',
                password: 'password123',
                business_name: 'Chisco Enterprises',
                department_name: 'Admin Department',
                user_type: 'DEPARTMENT_HEAD'
            });
        expect(dep_res.statusCode).to.equal(200);
        expect(dep_res.body).to.have.property('status').to.be.true;
    });

    it('should authenticate a department lead', async () => {
        let dep_res = await request(app)
            .post('/api/v1/auth/sign_in')
            .send({
                username: 'newLead',
                password: 'password123'
            });
        expect(dep_res.statusCode).to.equal(200);
        expect(dep_res.body).to.have.property('data');
    });

    it('should register a new business user', async () => {
        let biz_res = await request(app)
            .post('/api/v1/auth/sign_up')
            .send({
                username: 'test_business',
                password: 'password123',
                business_name: 'Chisco Enterprises',
                user_type: 'BUSINESS_OWNER'
            });
        expect(biz_res.statusCode).to.equal(200);
        expect(biz_res.body).to.have.property('status').to.be.true;
    });

    it('should authenticate a department lead', async () => {
        let biz_res = await request(app)
            .post('/api/v1/auth/sign_in')
            .send({
                username: 'test_business',
                password: 'password123'
            });
        expect(biz_res.statusCode).to.equal(200);
        expect(biz_res.body).to.have.property('data');
    });

});

describe('Business API', () => {

    it('should fetch order details for a business', async () => {
        let res = await request(app)
            .get(`/api/v1/business/order_detail`)
            .set('Authorization', `Bearer ${business_account}`);
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('details');
    });

    it('should fetch credit score for a business', async () => {
        const res = await request(app)
            .get(`dept_account`)
            .set('Authorization', `Bearer ${business_account}`);
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('data');
    });
});

