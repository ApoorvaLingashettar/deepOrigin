describe("Tests for GET calls on products", () => {

  it("GET all products", () => {
    cy.fixture("getAllProduct", (expectedData) => {
      cy.request("/products").then((response) => {
        expect(response.status).to.eq(200);

        expect(response.body).has.property("products");
        expect(response.body.products).has.length.greaterThan(0);

        expect(response.body).has.property("total", expectedData.total);
        expect(response.body).has.property("skip", expectedData.skip);
        expect(response.body).has.property("limit", expectedData.limit);
      });
    });
  });
});

describe("Tests for GET calls on product categories", () => {
  
  it("GET all product's categories", () => {
    cy.fixture("categoriesProduct").then((fixtureCategoriesData) => {
      cy.request("/products/categories").then((response) => {
        const expectedCategoroes = fixtureCategoriesData.expectedResult;

        expect(response.status).eq(200);
        expect(response.body).to.be.an("array").that.has.length.greaterThan(0);

        const observedCategories = response.body;

        expect(observedCategories.length).to.eq(expectedCategoroes.length);
        expectedCategoroes.forEach((category) => {
          expect(observedCategories).to.include(category);
        });
      });
    });
  }),

  it("GET products by category", () => {
    cy.fixture("categoriesProduct").then((fixtureCategoriesData) => {
      const testCategory = fixtureCategoriesData.testCategory;

      cy.request(`/products/category/${testCategory}`).then((response) => {
        const products = response.body.products;
        expect(response.status).eq(200);
        expect(products).to.be.an("array").that.has.length.greaterThan(0);

        products.forEach((record) => {
          expect(record.category).to.eql(testCategory);
        });
      });
    });
  }),

  it("GET products by category - NEGATIVE", () => {
    cy.fixture("categoriesProduct").then((fixtureCategoriesData) => {
      const inValidTestCategory = fixtureCategoriesData.inValidTestCategory;
      cy.request(`/products/category/${inValidTestCategory}`).then(
        (response) => {
          const products = response.body.products;
          expect(response.status).eq(200);
          expect(response.body).has.property("products");
          expect(response.body).has.property("total", 0);
          expect(products).to.be.an("array").that.has.lengthOf(0);
        },
      );
    });
  });
});

describe("Tests for GET calls on product - single product", () => {

  it("GET single product by id - POSITIVE scenario", () => {
    cy.fixture("getSingleProduct").then((fixtureData) => {
      const ReqData = fixtureData.testData;
      const expData = fixtureData.expectedData;

      cy.request(`/products/${ReqData.id}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).has.property("id", ReqData.id);

        expect(response.body).has.property("title", expData.title);
        expect(response.body).has.property("description", expData.description);
        expect(response.body).has.property("price", expData.price);

        expect(response.body).has.property(
          "discountPercentage",
          expData.discountPercentage,
        );
        expect(response.body).has.property("rating", expData.rating);
        expect(response.body).has.property("stock", expData.stock);
        expect(response.body).has.property("brand", expData.brand);
        expect(response.body).has.property("thumbnail");
        expect(response.body)
          .has.property("images")
          .to.be.an("array")
          .that.has.length.greaterThan(0);
      });
    });
  }),

  it("GET single product by id - NEGATIVE scenario", () => {
    cy.request(`/products/`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).has.property("total");

      const total = Number(response.body.total);
      const testId = total + 1;

      cy.request({
        url: `/products/${testId}`,
        method: "GET",
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).eq(404);
        expect(response.body.message).eq(
          `Product with id \'${testId}\' not found`,
        );
      });
    });
  });
});

describe("Tests for GET calls - search by product", () => {
  
  it("search products by GET query params", () => {
    cy.fixture("searchProduct").then((searchData) => {
      const searchItem = searchData.inputItem;

      cy.request({
        url: `products/search`,
        qs: { q: searchItem },
        method: "GET",
      }).then((response) => {
        expect(response.status).to.eq(200);

        expect(response.body).has.property("total", searchData.total);
        expect(response.body).has.property("skip", 0);
        expect(response.body).has.property("limit", searchData.limit);
      });
    });
  }),

    /*
  Expeted Failure - the GET call is not searching and returning the results precicely
  **/
  it("search products by GET query params - verify result precision", () => {
    cy.fixture("searchProduct").then((searchData) => {
      const searchItem = searchData.inputItem;

      cy.request({
        url: `products/search`,
        qs: { q: searchItem },
        method: "GET",
      }).then((response) => {
        expect(response.status).to.eq(200);

        const searchResultProducts = response.body.products;
        searchResultProducts.forEach((record) => {
          expect(record.title).includes(
            searchItem.charAt(0).toUpperCase() + searchItem.slice(1),
          );
        });
      });
    });
  }),

  it("search products by GET query params - NEGATIVE invalid query param", () => {
    cy.fixture("searchProduct").then((searchData) => {
      const InvalidSearchItem = searchData.invalidInputItem;

      cy.request({
        url: `products/search`,
        qs: { q: InvalidSearchItem },
        failOnStatusCode: false,
        method: "GET",
      }).then((response) => {
        expect(response.status).to.eq(200);

        expect(response.body).has.property("total", 0);
        expect(response.body).has.property("skip", 0);
        expect(response.body).has.property("limit", 0);

        expect(response.body).to.have.property("products");
        expect(response.body.products).to.have.length(0);
      });
    });
  });
});

describe("Tests for GET calls on product - limit and skip products", () => {

  it("limit and skip with GET products, query params", () => {
    cy.fixture("limitSkipProduct").then((limitSkipFixtureData) => {
      const limit = limitSkipFixtureData.limit;
      const skip = limitSkipFixtureData.skip;
      const seletParams1 = limitSkipFixtureData.selectParam1;
      const seletParams2 = limitSkipFixtureData.selectParam2;
      cy.request({
        method: "GET",
        url: `/products`,
        qs: {
          limit: limit,
          skip: skip,
          select: `${seletParams1},${seletParams2}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);

        expect(response.body).to.have.property("products");
        expect(response.body.products).to.have.length.greaterThan(0);

        expect(response.body).to.have.property(
          "skip",
          limitSkipFixtureData.skip,
        );
        expect(response.body).to.have.property(
          "limit",
          limitSkipFixtureData.limit,
        );

        cy.wrap(response.body.products).each((product) => {
          expect(product).to.include.all.keys([
            "id",
            seletParams1,
            seletParams2,
          ]);
          expect(Object.keys(product).length).to.equal(3);
        });
      });
    });
  }),

  it("limit and skip with GET products, query params - NEGATIVE", () => {
    cy.fixture("limitSkipProduct").then((limitSkipFixtureData) => {
      const limit = limitSkipFixtureData.limit;
      const skip = limitSkipFixtureData.skip;
      const inValidParam = limitSkipFixtureData.inValidParam;

      cy.request({
        method: "GET",
        url: `/products`,
        qs: {
          select: inValidParam,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);

        expect(response.body).to.have.property("products");
        expect(response.body.products).to.have.length.greaterThan(0);

        cy.wrap(response.body.products).each((product) => {
          expect(product).to.include.all.keys(["id"]);
          expect(Object.keys(product).length).to.equal(1);
        });
      });
    });
  });
});
