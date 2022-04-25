const Repro = artifacts.require("Repro");
const util = require("util");
const axios = require("axios");

contract("Repro", function () {

  let instance, req, rawReq;

  before(async function () {
    instance = await Repro.deployed();
    web3Req = await instance.run.request();
    providerReq = {
      jsonrpc: "2.0",
      method: "eth_call",
      id: Date.now(),
      params: [web3Req, "latest"]
    };
    httpReq = JSON.stringify(providerReq);
  });

  it("should get correct error message via web3", async function () {
    try {
      await web3.eth.call(web3Req);
      assert.fail("The above call should revert!");
    } catch (err) {
      assert.notInclude(err.message, "Â¡Â¡Â¡", "Message should not contain UTF-8 -> ISO-8859-1 mojibake");
      assert.include(err.message, "¡¡¡", "Message should contain correct decoding of UTF-8");
    }
  });

  it("should get correct error message via web3 provider", async function () {
    const provider = web3.currentProvider;
    const result = await util.promisify(provider.send.bind(provider))(providerReq);
    const err = result.error;
    assert.notInclude(err.message, "Â¡Â¡Â¡", "Message should not contain UTF-8 -> ISO-8859-1 mojibake");
    assert.include(err.message, "¡¡¡", "Message should contain correct decoding of UTF-8");
  });

  it("should get correct error message via axios", async function () {
    const url = web3.currentProvider.host;
    const response = await axios.post(url, httpReq);
    const err = response.data.error;
    assert.notInclude(err.message, "Â¡Â¡Â¡", "Message should not contain UTF-8 -> ISO-8859-1 mojibake");
    assert.include(err.message, "¡¡¡", "Message should contain correct decoding of UTF-8");
  });
});
