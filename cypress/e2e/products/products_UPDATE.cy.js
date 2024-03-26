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
