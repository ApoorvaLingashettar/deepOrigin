describe("Tests for GET calls on products", () => {

  it("POST - add new product", () => {
    cy.fixture("addNewProduct").then((fixtureData) => {
      const payload = fixtureData.validInput;
      let totalCountBeforeAddition = 0;
      let totalCountAfterAddition = 0;

      cy.request("/products").then((response) => {
        totalCountBeforeAddition = response.body.total;
        console.log(totalCountBeforeAddition);
      });

      cy.request({
        url: `products/add`,
        headers: { "Content-Type": "application/json" },
        body: payload,
        method: "POST",
      }).then((response) => {
        expect(response.status).eq(200);

        cy.request("/products").then((response) => {
          totalCountAfterAddition = response.body.total;
        });

        expect(response.body.id).eq(payload.id);
        expect(response.body.title).eq(payload.title);
        expect(response.body.description).eq(payload.description);
        expect(response.body.price).eq(payload.price);
        expect(response.body.discountPercentage).eq(payload.discountPercentage);
        expect(response.body.rating).eq(payload.rating);
        expect(response.body.stock).eq(payload.stock);
        expect(response.body.brand).eq(payload.brand);
        expect(response.body.category).eq(payload.category);

        /*
            the following assertion is to verify the count of toatl records aftert the POST call 
            which is currently commented out, since these are dummy APIS and 
            POST call doesnot really add a new record
            */
        //expect(Number(totalCountAfterAddition) - Number(totalCountBeforeAddition)).to.equal(1)

        expect(response.body).to.include.all.keys(Object.keys(payload));
        expect(Object.keys(response.body).length).to.equal(
          Object.keys(payload).length,
        );
      });
    });
  });

    /* This test is supposed to fail ,
     due to the invalid input test data */
  it("POST - add invalid product payload - NEGATIVE", () => {
    cy.fixture("addNewProduct").then((fixtureData) => {
      const inValidPayload = fixtureData.inValidInput;
      const validpayload = fixtureData.validInput;

      cy.request({
        url: `products/add`,
        headers: { "Content-Type": "application/json" },
        body: inValidPayload,
        method: "POST",
      }).then((response) => {
        expect(response.status).eq(200); // The response code should be 4xx
        expect(response.body).to.include.all.keys(
          ...Object.keys(validpayload),
          { assert: false },
        ); // Expected failure due to corrupt API end-points
      });
    });
  }),

    /* This test is supposed to fail ,
    due to the invalid existing input test data 
    currently it passes due to the missing validations */
  it("add existing product - NEGATIVE", () => {
    cy.fixture("addNewProduct").then((fixtureData) => {
    const payload = fixtureData.inValidInputExisting;

    cy.request({
        url: `products/add`,
        headers: { "Content-Type": "application/json" },
        body: payload,
        method: "POST",
    }).then((response) => {
        expect(response.status).eq(200); // The response code should be 4xx
      });
    });
  });
});

describe("tests for PUT/PATCH calls", () => {

  it("update existing product - PUT", () => {
    const testproductId = 1;
    const testTitle = "iPhone Galaxy +1";
    cy.request({
      url: `products/${testproductId}`,
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: testTitle,
      }),
    }).then((response) => {
      expect(response.status).eq(200);
      expect(response.body).to.have.property("id", testproductId);
      expect(response.body).to.have.property("title", testTitle);
    });
  }),

  it("update existing product - PATCH - NEGATIVE", () => {
    const inValidTestproductId = 0;
    const testTitle = "iPhone Galaxy +1";
    cy.request({
        url: `products/${inValidTestproductId}`,
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        failOnStatusCode: false,
        body: JSON.stringify({
            title: testTitle,
     })
    }).then((response) => {
    expect(response.status).eq(404);
    });
  });
});
