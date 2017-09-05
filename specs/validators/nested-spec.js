describe('validator.items', function() {

  var items = validate.validators.items.bind(validate.validators.items);
  var properties = validate.validators.properties.bind(validate.validators.properties);

  describe("propagates options as sub-validations", function() {
    it("applies equality and inclusion validations to interior attributes", function() {
      var schema = {
        inclusion: {
          within: ["foo", "bar", "baz"],
          message: "%{value} is not in the list!"
        }
      };
      var val = ["foo", "bar", "three"];
      var res = items(val, schema);
      expect(res).toEqual({
        "[2]": [
          "three is not in the list!"
        ]
      });
    });
  });

  describe("supports multiple layers of nesting", function() {
    it("supports two layers of value constraints", function() {
      var schema = {
        "array": {
          items: {
            items: {
              inclusion: {
                within: ["validVal"]
              }
            }
          }
        }
      };
      var validCase = {
        array: [["validVal"], []]
      };
      var invalidCase = {
        array: [["invalidVal", "validVal", "two"], []]
      };
      expect(validate(validCase, schema)).not.toBeDefined();
      expect(validate(invalidCase, schema)).toBeDefined();
    });
  });

  describe("supports presence of nested items", function() {
    it("supports two layers of value constraints", function() {
      var schema = {
        "array": {
          items: {
            properties: {
              test: {
                presence: {
                }
              }
            }
          }
        }
      };
      var validCase = {
        array: [{test: 'foo'}, {test: 'bar'}]
      };
      var invalidCase1 = {
        array: [{test: 'foo'}, {other: 'bar'}]
      };
      var invalidCase2 = {
        array: [{other: 'bar'}, {test: 'foo'}]
      };
      expect(validate(validCase, schema)).not.toBeDefined();
      expect(validate(invalidCase1, schema)).toBeDefined();
      expect(validate(invalidCase2, schema)).toBeDefined();
    });
  });

  describe("supports presence in validator on nested object", function() {
    it("allows validators on parent level", function() {
      var schema = {
        "obj": {
          properties: {
            test: {
              items: {
                properties: {
                  test2: {
                    presence: {}
                  }
                }
              },
              length: {
                minimum: 2
              }
            }
          }
        }
      };
      var validCase = {
        obj: {test: [{test2: 'foo'}, {test2: 'bar'}]}
      };
      var invalidCase1 = {
        obj: {test: [{invalid: 'foo'}]}
      };
      expect(validate(validCase, schema)).not.toBeDefined();
      expect(validate(invalidCase1, schema)).toBeDefined();
    });
  });

  describe("handles items inside arrays", function() {
    it("allows value specification targeting arrays", function() {
      var schema = {
        inclusion: {
          within: ["validVal"]
        }
      };
      expect(items(["validVal"], schema)).not.toBeDefined();
      expect(items(["invalidVal"], schema)).toBeDefined();
    });
  });

  describe("handles objexts inside array", function() {
    it("allows value specification targeting objects", function() {
      var schema = {
        properties: {
          someKey: {
            inclusion: {
              within: ["validVal"]
            }
          }
        }
      };
      expect(items([{someKey: "validVal"}], schema)).not.toBeDefined();
      expect(items([{someKey: "invalidVal"}], schema)).toBeDefined();
    });
  });
/*
  describe("rejects things that are not arrays", function() {
    it("rejects things that are not arrays", function() {
      var schema = {
        inclusion: {
          within: ["validVal"]
        }
      };
      expect(items("notAnArray", schema)).toBeDefined();
      expect(items("notAnArray", schema)).toEqual("is not an array");
    });
  });

  describe("rejects things that are not objects", function() {
    it("rejects things that are not object", function() {
      var schema = {
        inclusion: {
          within: ["validVal"]
        }
      };
      expect(properties("notAnObject", schema)).toBeDefined();
      expect(properties("notAnObject", schema)).toEqual("is not an object");
    });
  });
  */
});
