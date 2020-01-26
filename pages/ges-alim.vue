<template>
  <div>
    <header class="header section">
      <h1 class="title is-4">
        Quel impact de l'alimentation <br> sur les émissions de gaz à effet de serre ?
      </h1>
      <b-field grouped group-multiline>
        <b-field label-position="on-border" label="Tri">
          <b-select v-model="sort">
            <option v-for="option in sortOptions" :value="option.key">
              {{ option.label }}
            </option>
          </b-select>
        </b-field>
        <b-field label="Direction" label-position="on-border">
          <b-select v-model="direction">
            <option value="desc"> Décroissant </option>
            <option value="asc"> Croissant </option>
          </b-select>
        </b-field>

        <b-field label="Métrique" label-position="on-border" :message="metricMessage">
          <b-select v-model="metric">
            <option v-for="option in metricOptions" :value="option.key">
              {{ option.label }}
            </option>
          </b-select>
        </b-field>

        <b-field>
          <b-checkbox v-model="displayAll">Afficher<br/>toutes les données</b-checkbox>
        </b-field>
      </b-field>
    </header>
    <div>
      <ve-bar ref="chart" :height="`${120 + 20 * chartData.rows.length}px`" :judge-width="true" :toolbox="toolbox"
        :settings="chartSettings" :data="chartData" :extend="chartOptions" :colors="colors" />
    </div>

    <div class="section content">
      <h2 class="title is-5"> Remarques </h2>
      <ul>
        <li> 🏭 L'alimentation est responsable d'environ ¼ des émissions de gaz à effet de serre résultant de l'activité humaine. </li>
        <li> 🚚 Le transport ne représente qu'une très petite part (environ 5%) des émissions liées à l'alimentation. L'impact du transport est encore plus petit (moins d'1%) pour la viande de boeuf. Même à produit équivalent,
          consommer local ne garantit pas une réduction de son impact. L'importation est parfois moins émettrice que de cultiver en serre des produits hors-saison
          (<a href="https://www.researchgate.net/publication/225434851_The_role_of_seasonality_in_lettuce_consumption_A_case_study_of_environmental_and_social_aspects">Hospido 2009</a>). </li>
        <li>
          🥩 De manière générale, les produits d'origine animale (viande, lait, oeufs, ...) émettent jusqu'à plusieurs dizaines de fois davantage que ceux d'origine végétale.
          Ils sont responsables de près de 60% des émissions liées à l'alimentation, alors qu'ils ne comptent que pour 37% de nos apports en protéine et de 18% de nos calories.
          Ils occupent 83% des terres agricoles.
        </li>
        <li>
          🐄 Le pire bilan est de loin pour les ruminants, qui rejettent du méthane. ⅔ des terres qu'ils occupent ne sont pas adaptées à la plupart des autres cultures.
          Cependant, même si les prairies peuvent contribuer à la séquestration du CO₂, elles ne réduiraient ces émissions que de 22% dans les meilleurs cas, au prix d'une occupation des terres encore supérieure à celle actuelle.
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
  import 'echarts/lib/component/toolbox';
  import VeBar from 'v-charts/lib/bar.min';
  import data from '../data/ges-nourriture.txt';

  const columns = ['luc', 'feed', 'farm', 'processing', 'transport', 'packging', 'retail'];
  const rows = data.split('\n').slice(1).filter(Boolean).map(r => r.split(','))
    .map((row) => {
      const cols = {
        featured: row[0] === '+',
        name: row[1],
        comment: row[11] || '',
        product: { total: row.slice(2, 9).reduce((acc, e) => acc + Number(e), 0) },
        calorie: row[9] > 100 ? { total: (row.slice(2, 9).reduce((acc, e) => acc + Number(e), 0)) / row[9] * 100 } : null,
        proteine: row[10] > 4 ? { total: (row.slice(2, 9).reduce((acc, e) => acc + Number(e), 0)) / row[10] * 100 } : null
      };

      row.slice(2, 9).forEach((c, i) => (cols.product[columns[i]] = Number(c)));
      if (cols.calorie) row.slice(2, 9).forEach((c, i) => (cols.calorie[columns[i]] = Number(c) / row[9] * 100));
      if (cols.proteine) row.slice(2, 9).forEach((c, i) => (cols.proteine[columns[i]] = Number(c) / row[10] * 100));

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
    components: { VeBar },
    head() {
      return {
        title: 'Impact de l\'alimentation sur les GES — Les Écorats',
        meta: [
          { hid: 'description', name: 'description', content: 'Quel impact de l\'alimentation sur les émissions de gaz à effet de serre ? Une data visualisation interractive.' },
          { hid: 'og:title', name: 'og:title', content: 'Impact de l\'alimentation sur les GES — Les Écorats' },
          { hid: 'og:title', name: 'og:site_name', content: 'http://stats.ecorats.org' },
          { hid: 'og:url', name: 'og:url', content: 'http://stats.ecorats.org/ges-alim' },
          { hid: 'og:type', name: 'og:type', content: 'article' },
          { hid: 'og:image', name: 'og:image', content: 'http://stats.ecorats.org/preview.png' },
          { hid: 'og:description', name: 'og:description', content: 'Quel impact de l\'alimentation sur les émissions de gaz à effet de serre ? Une data visualisation interractive.' },
          { hid: 'twitter:site', name: 'twitter:site', content: '@LesEcoRats' },
          { hid: 'twitter:creator', name: 'twitter:creator', content: '@LesEcoRats' }
        ]
      };
    },
    data() {
      return {
        metric: 'product',
        metricOptions: [
          { key: 'product', label: 'par kg de nourriture', short: 'kg' },
          { key: 'calorie', label: 'pour 1000 kcal', short: 'Mcal' },
          { key: 'proteine', label: 'par kg de protéine', short: 'kprot' }
        ],
        displayAll: false,
        offset: 0,
        sort: 'total',
        direction: 'desc',
        sortOptions: [
          { key: 'total', label: 'Total des émissions' },
          ...Object.entries(labelMap).map(([key, label]) => ({ key, label }))
        ],
        colors: ['#34b666', '#ffcc00', '#706c61', '#1892fa', '#f7630c', '#916dd5', '#1dd3c4'],
        toolbox: {
          right: 20,
          bottom: 20,
          showTitle: false,
          feature: { saveAsImage: { title: 'Sauvegarder' } }
        }
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
        let minInterval = 15;
        if (this.metric === 'proteine') minInterval = 5;
        if (this.metric === 'calorie') minInterval = 1;

        let padding = -200;
        if (this.metric === 'proteine') padding = -190;
        if (this.metric === 'calorie') padding = -170;

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
            formatter: (items) => {
              const item = rows.find(r => r.name === items[0].name);
              const unit = this.metricOptions.find(o => o.key === this.metric).short;
              return `
                <span class="tooltip-header">
                  <b> ${items[0].axisValueLabel} </b>
                  —
                  <b>${this.round(item[this.metric].total)}</b> kgCO₂ / ${unit}
                </span>
                ${items.map(i => `${i.marker} ${i.seriesName} : <b>${this.round(i.value)}</b> kgCO₂ / ${unit}`).join('<br>')}
                ${item.comment ? `<div class="tooltip-comment">${item.comment}</div>` : ''}
              `;
            }
          },
          legend: {
            itemWidth: 10,
            textStyle: { fontFamily: 'Raleway' },
            icon: 'circle'
          },
          xAxis: {
            name: `kg de CO₂ émis ${this.metricOptions.find(o => o.key === this.metric).label}`,
            nameLocation: 'end',
            nameTextStyle: { fontFamily: 'Raleway', padding: [0, 0, 55, padding] },
            position: 'top',
            splitLine: { show: false },
            axisLabel: { showMinLabel: false, formatter: this.round },
            axisLine: { show: false },
            axisTick: { show: true },
            margin: 80,
            minInterval
          },
          yAxis: {
            z: 3,
            offset: this.offset,
            axisLabel: {
              textShadowColor: 'white',
              textShadowBlur: 20,
              fontFamily: 'Raleway',
              margin: 5,
              interval: 0
            }
          }
        };
      },
      chartData() {
        return {
          columns: ['name', ...columns],
          rows: rows
            .filter(r => (this.displayAll || r.featured) && r[this.metric])
            .map(row => Object.assign({ name: row.name }, row[this.metric]))
        };
      },
      metricMessage() {
        if (this.metric === 'proteine') return 'Source : USDA (>4g/100g)';
        if (this.metric === 'calorie') return 'Source : USDA (>100kcal/100g)';
        return '';
      }
    },
    methods: {
      computeOffset() {
        this.$nextTick(() => {
          if (!this.$refs.chart || !this.$refs.chart.$refs.canvas) return;
          if (this.metric === 'product') this.offset = -this.$refs.chart.$refs.canvas.offsetWidth / 40;
          if (this.metric === 'calorie') this.offset = -this.$refs.chart.$refs.canvas.offsetWidth / 16;
          if (this.metric === 'proteine') this.offset = -this.$refs.chart.$refs.canvas.offsetWidth / 120;
        });
      },
      round(v) {
        return this.$n(String(Math.round(v * 100) / 100));
      }
    },
    watch: {
      metric() {
        this.computeOffset();
      }
    },
    mounted() {
      this.computeOffset();
      window.addEventListener('resize', this.computeOffset);
    },
    destroy() {
      window.removeEventListener('resize', this.computeOffset);
    }
  };
</script>
