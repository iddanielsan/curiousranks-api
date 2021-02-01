'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsersSchema extends Schema {
  up () {
    this.collection('users', (collection) => {
      collection.index('email_index', {email: 1}, {unique: true})
      collection.index('username_index', {username: 1}, {unique: true})
      collection.index('facebook_index', {facebook: 1}, {unique: true})
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UsersSchema
