<template>
  <div class="container">
  <b-col>
    Nombre total de livres: {{totalRows}}
  </b-col>
  <b-input-group size="sm">
    <b-form-input
      v-model="filter"
      v-on:keyup="getBooks()"
      type="search"
      id="filterInput"
      placeholder="Rechercher des livres...">
    </b-form-input>
    <b-input-group-append>
      <b-button :disabled="!filter" @click="filter = ''">Clear
      </b-button>
    </b-input-group-append>
  </b-input-group>
    <b-table
      v-if="isNotEmpty()"
      show-empty
      striped
      hover
      outlined
      :items="getData()"
      :fields="fields"
      :filter="filter"
      @filtered="onFiltered"
      :current-page="currentPage"
      :per-page="perPage">

      <template #cell(buyLink)="data">
        <a :href="data.item.buyLink">{{data.item.buyLink}}</a>
      </template>

    </b-table>
    <b-table
      v-else
      show-empty
      striped
      hover
      outlined
    >
    </b-table>
    <div>
      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        align="fill"
        size="sm"
        class="my-0"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
const axios = require('axios')
export default {
  name: 'GoogleBook',
  data () {
    return {
      empty: true,
      infos: [],
      items: '',
      url: '',
      filter: '',
      totalRows: 0,
      currentPage: 1,
      perPage: 15,
      fields: [
        {
          key: 'title',
          label: 'Titre de l\'ouvrage'
        },
        {
          key: 'authors',
          label: 'Auteur(s)'
        },
        {
          key: 'price',
          label: 'Prix de vente'
        },
        {
          key: 'buyLink',
          label: 'Lien vers l\'article'
        }
      ]
    }
  },
  mounted () {
    this.totalRows = this.items.length
  },
  methods: {
    getData () {
      let result = []
      this.infos.map(item => {
        this.title = item.volumeInfo.title ? item.volumeInfo.title : ''
        this.authors = item.volumeInfo.authors ? item.volumeInfo.authors.join() : ''
        this.price = item.saleInfo.listPrice ? item.saleInfo.listPrice.amount + ' ' + item.saleInfo.listPrice.currencyCode : ''
        this.buyLink = item.saleInfo.buyLink ? item.saleInfo.buyLink : ''
        this.infoLink = item.volumeInfo.infoLink ? item.volumeInfo.infoLink : ''
        this.previewLink = item.volumeInfo.previewLink ? item.volumeInfo.previewLink : ''
        this.caconicalVolumeLink = item.volumeInfo.caconicalVolumeLink ? item.volumeInfo.caconicalVolumeLink : ''
        result.push(
          {
            'title': this.title,
            'authors': this.authors,
            'price': this.price,
            'buyLink': this.buyLink,
            'infoLink': this.infoLink,
            'previewLink': this.previewLink,
            'caconicalVolumeLink': this.caconicalVolumeLink
          }
        )
      })
      return result
    },
    getBooks () {
      if (this.filter !== '') {
        axios.get('https://www.googleapis.com/books/v1/volumes?q=' + this.filter + '&maxResults=40')
          .then(response => (this.infos = response.data.items))
      } else {
        this.infos = null
        this.totalRows = 0
      }
    },
    onFiltered (filteredItems) {
      this.totalRows = filteredItems.length
    },
    isNotEmpty () {
      if (!this.filter || !this.infos) {
        this.infos = null
        this.totalRows = 0
      }
      return this.filter && this.infos
    }
  }
}
</script>
