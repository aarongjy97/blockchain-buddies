<template>
  <div class="container">
    <Navbar />

    <h3 style="text-align: center;">Register</h3>

    <div
      class="container d-flex flex-column align-items-center justify-content-center mt-4"
    >
      <span>
        To register for listing, sale, procurement and delivery of products on
        the marketplace, first deploy the contract that suits your company.
      </span>
    </div>

    <div class="container mt-5">
      <b-row>
        <b-col>
          <b-card style="position: relative;">
            <b-card-body
              class="d-flex flex-column align-items-center justify-content-center w-100 h-100"
            >
              <svg
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 512 512"
                style="enable-background:new 0 0 512 512; height: 45px; width: 45px;"
                xml:space="preserve"
              >
                <g>
                  <g>
                    <path
                      d="M382.56,233.376C379.968,227.648,374.272,224,368,224h-64V16c0-8.832-7.168-16-16-16h-64c-8.832,0-16,7.168-16,16v208h-64
			c-6.272,0-11.968,3.68-14.56,9.376c-2.624,5.728-1.6,12.416,2.528,17.152l112,128c3.04,3.488,7.424,5.472,12.032,5.472
			c4.608,0,8.992-2.016,12.032-5.472l112-128C384.192,245.824,385.152,239.104,382.56,233.376z"
                    />
                  </g>
                </g>
                <g>
                  <g>
                    <path
                      d="M432,352v96H80v-96H16v128c0,17.696,14.336,32,32,32h416c17.696,0,32-14.304,32-32V352H432z"
                    />
                  </g>
                </g>
              </svg>
              <a class="stretched-link" href="../../../../backend/blockchain/contracts/Procurer.sol">
                <h5 class="mt-4">Procurer</h5>
              </a>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col>
          <b-card>
            <b-card-body
              class="d-flex flex-column align-items-center justify-content-center w-100 h-100"
            >
              <svg
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 512 512"
                style="enable-background:new 0 0 512 512; height: 45px; width: 45px;"
                xml:space="preserve"
              >
                <g>
                  <g>
                    <path
                      d="M382.56,233.376C379.968,227.648,374.272,224,368,224h-64V16c0-8.832-7.168-16-16-16h-64c-8.832,0-16,7.168-16,16v208h-64
			c-6.272,0-11.968,3.68-14.56,9.376c-2.624,5.728-1.6,12.416,2.528,17.152l112,128c3.04,3.488,7.424,5.472,12.032,5.472
			c4.608,0,8.992-2.016,12.032-5.472l112-128C384.192,245.824,385.152,239.104,382.56,233.376z"
                    />
                  </g>
                </g>
                <g>
                  <g>
                    <path
                      d="M432,352v96H80v-96H16v128c0,17.696,14.336,32,32,32h416c17.696,0,32-14.304,32-32V352H432z"
                    />
                  </g>
                </g>
              </svg>
              <a class="stretched-link" href="../../../../backend/blockchain/contracts/Supplier.sol">
                <h5 class="mt-4">Supplier</h5>
              </a>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col>
          <b-card>
            <b-card-body
              class="d-flex flex-column align-items-center justify-content-center w-100 h-100"
            >
              <svg
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 512 512"
                style="enable-background:new 0 0 512 512; height: 45px; width: 45px;"
                xml:space="preserve"
              >
                <g>
                  <g>
                    <path
                      d="M382.56,233.376C379.968,227.648,374.272,224,368,224h-64V16c0-8.832-7.168-16-16-16h-64c-8.832,0-16,7.168-16,16v208h-64
			c-6.272,0-11.968,3.68-14.56,9.376c-2.624,5.728-1.6,12.416,2.528,17.152l112,128c3.04,3.488,7.424,5.472,12.032,5.472
			c4.608,0,8.992-2.016,12.032-5.472l112-128C384.192,245.824,385.152,239.104,382.56,233.376z"
                    />
                  </g>
                </g>
                <g>
                  <g>
                    <path
                      d="M432,352v96H80v-96H16v128c0,17.696,14.336,32,32,32h416c17.696,0,32-14.304,32-32V352H432z"
                    />
                  </g>
                </g>
              </svg>
              <a class="stretched-link" href="../../../../backend/blockchain/contracts/Courier.sol">
                <h5 class="mt-4">Courier</h5>
              </a>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </div>

    <div class="container d-flex flex-column align-items-center justify-content-center mt-5">
      <h5>
        Market Address
      </h5>
      <code>
        {{ address }}
      </code>
      <span class="mt-2">
        Deploy the selected contract with the market address to access all of the market's functionalities
      </span>
    </div>
  </div>
</template>

<script>
import Navbar from "./Navbar.vue";
import Market from "../../api/Market";
export default {
  name: "ProcurerMain",
  data() {
    return {
      address: ''
    };
  },
  components: {
    Navbar,
  },
  methods: {
    async getMarketAddress() {
      const market = await Market.getMarketAddress();
      this.address = market.data;
    }
  },
  mounted() {
    this.getMarketAddress();
  }
};
</script>

<style>
.card-download {
  display: flex;
  align-items: center;
  justify-content: center;
}

a {
  color: unset;
}

a:hover {
  text-decoration: none;
}
</style>
