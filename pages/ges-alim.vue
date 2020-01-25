<template>
  <div>
    <header class="header section">
      <h1 class="title is-4">
        Quel impact de l'alimentation <br> sur les émissions de gaz à effet de serre ?
      </h1>
      <b-field grouped group-multiline>
        <b-field grouped>
          <b-field label-position="on-border" label="Tri">
            <b-select v-model="sort">
              <option v-for="option in sortOptions" :value="option.key">
                {{ option.label }}
              </option>
            </b-select>
          </b-field>
          <b-field label="Direction" label-position="on-border" grouped>
            <b-select v-model="direction">
              <option value="desc"> Décroissant </option>
              <option value="asc"> Croissant </option>
            </b-select>
          </b-field>
        </b-field>
        <b-field>
          <b-checkbox v-model="displayAll">Afficher<br/>toutes les données</b-checkbox>
        </b-field>
      </b-field>
    </header>
    <div>
      <ve-bar ref="chart" :height="`${25 * chartData.rows.length}px`"
        :settings="chartSettings" :data="chartData" :extend="chartOptions" :colors="colors" />
    </div>

    <div class="section content">
      <h2 class="title is-5"> Remarques </h2>
      <ul>
        <li> L'alimentation est responsable d'environ ¼ des émissions de gaz à effet de serre résultant de l'activité humaine. </li>
        <li> Le transport ne représente qu'une très petite part (environ 5%) des émissions liées à l'alimentation. L'impact du transport est encore plus petit (moins d'1%) pour la viande de boeuf. </li>
        <li> Même à produit équivalent, consommer local ne garantit pas une réduction de son impact. L'importation est parfois moins émettrice que de cultiver en serre des produits hors-saison
          (<a href="https://www.researchgate.net/publication/225434851_The_role_of_seasonality_in_lettuce_consumption_A_case_study_of_environmental_and_social_aspects">Hospido 2009</a>). </li>
        <li>
          De manière générale, les produits d'origine animale émettent jusqu'à plusieurs dizaines de fois davantage que ceux d'origine végétale.
          Ils sont responsables d'au moins 83% des émissions liés à l'alimentation (<a href="https://www.sciencedirect.com/science/article/pii/S2211912418300361">Sandström 2018</a>).
        </li>
      </ul>

      <h2 class="title is-5"> Remerciements </h2>
      <ul>
        <li> Hannah Ritchie via <a href="https://ourworldindata.org/food-choice-vs-eating-local">ourwoldindata.org</a>, dont ce résumé est directement issu. </li>
        <li> Marc Robinson-Rechavi pour avoir porté à notre connaissance ces données. </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import 'echarts/lib/component/title';
  import VeBar from 'v-charts/lib/bar.min';
  import data from '../data/ges-nourriture.txt';

  const columns = ['luc', 'feed', 'farm', 'processing', 'transport', 'packging', 'retail'];
  const rows = data.split('\n').filter(Boolean).map(r => r.split(',')).map((row) => {
    const cols = {
      featured: row[0] === '+',
      name: row[1],
      note: row[9] || '',
      total: row.slice(2, 9).reduce((acc, e) => acc + Number(e), 0)
    };
    row.slice(2, 9).forEach((c, i) => (cols[columns[i]] = Number(c)));
    console.log(cols);
    return cols;
  });

  const labelMap = {
    luc: 'Utilisation\ndes terres',
    feed: 'Alimentation\nanimale',
    farm: 'Émissions\nagricoles',
    processing: 'Transformation',
    transport: 'Transport',
    packging: 'Emballage',
    retail: 'Vente\n& stockage'
  };

  export default {
    name: 'Impact de l\'alimentation sur les émissions de GES',
    components: { VeBar },
    data() {
      return {
        displayAll: false,
        offset: 0,
        sort: 'total',
        direction: 'desc',
        sortOptions: [
          { key: 'total', label: 'Total des émissions' },
          ...Object.entries(labelMap).map(([key, label]) => ({ key, label }))
        ],
        colors: ['#34b666', '#ffcc00', '#706c61', '#1892fa', '#f7630c', '#916dd5', '#1dd3c4']
      };
    },
    computed: {
      chartSettings() {
        return {
          itemStyle: { normal: { borderColor: 'white', borderWidth: 1 } },
          stack: { total: columns },
          min: [-2.1],
          dataOrder: {
            label: this.sort,
            order: this.direction
          },
          labelMap
        };
      },
      chartOptions() {
        return {
          title: {
            text: 'Émissions de gaz à effet de serre',
            textStyle: { fontFamily: 'Raleway', fontWeight: 'normal', fontSize: 15, lineHeight: 0 },
            subtext: 'Source : Poore & Nemecek 2018',
            subtextStyle: { fontFamily: 'Raleway' },
            sublink: 'https://science.sciencemag.org/content/360/6392/987',
            textAlign: 'center',
            bottom: 5,
            left: '50%'
          },
          animation: false,
          grid: { left: 0, top: 60, bottom: 50, right: 60 },
          tooltip: {
            confine: true,
            axisPointer: { type: 'shadow' },
            textStyle: { fontFamily: 'Raleway', color: 'black' },
            backgroundColor: 'rgba(255,255,255,.7)',
            borderRadius: 0,
            formatter(items) {
              const item = rows.find(r => r.name === items[0].name);
              return `
                <span class="tooltip-header">
                  <b> ${items[0].axisValueLabel} </b>
                  —
                  <b>${item.total.toFixed(2).replace('.', ',')}</b> kgCO2 / kg
                </span>
                ${items.map(i => `${i.marker} ${i.seriesName} : <b>${String(i.value).replace('.', ',')}</b> kgCO2 / kg`).join('<br>')}
                ${item.note ? `<div class="tooltip-note">${item.note}</div>` : ''}
              `;
            }
          },
          legend: {
            itemWidth: 10,
            textStyle: { fontFamily: 'Raleway' },
            icon: 'circle'
          },
          xAxis: {
            name: 'kg de CO2 émis par kg de nourriture',
            nameLocation: 'end',
            nameTextStyle: { fontFamily: 'Raleway', padding: [0, 0, 55, -210] },
            position: 'top',
            splitLine: { show: false },
            axisLabel: { showMinLabel: false },
            axisLine: { show: false },
            axisTick: { show: true },
            minInterval: 15,
            margin: 80
          },
          yAxis: {
            offset: this.offset,
            axisLabel: {
              fontFamily: 'Raleway',
              margin: 5,
              interval: 0,
              formatter(a) {
                if (a.indexOf('Noix') !== -1) return `${a}         `;
                return a;
              }
            }
          }
        };
      },
      chartData() {
        return {
          columns: ['name', ...columns],
          rows: rows.filter(r => this.displayAll || r.featured)
        };
      }
    },
    methods: {
      resize() {
        this.$nextTick(() => (this.offset = -this.$refs.chart.$refs.canvas.offsetWidth / 40));
      }
    },
    mounted() {
      this.offset = -this.$refs.chart.$refs.canvas.offsetWidth / 40;
      window.addEventListener('resize', this.resize);
    },
    destroy() {
      window.removeEventListener('resize', this.resize);
    }
  };
</script>
