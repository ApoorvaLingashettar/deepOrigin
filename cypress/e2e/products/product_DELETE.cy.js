describe("Tests for DELEET calls on products", () => {
  it("DELETE existing product", () => {
    cy.fixture("addNewProduct").then((fixtureData) => {
      const validData = fixtureData.validInput;
      const testproductId = 1;
      cy.request({
        url: `products/${testproductId}`,
        method: "DELETE",
      }).then((response) => {
        expect(response.body).to.include.all.keys(Object.keys(validData));
      });

      cy.request(`product/${testproductId}`).then((response) => {
        expect(response.status).eq(200); // the get call on the successfull deletion shoud not return 200
      });
    });
  });

  it("DELETE non existing product - NEGATIVE", () => {
    const testproductId = 0;
    cy.request({
      url: `products/${testproductId}`,
      method: "DELETE",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).eq(404);
    });
  });
});
