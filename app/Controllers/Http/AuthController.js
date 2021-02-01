'use strict'

const Env = use('Env')
const axios = use('axios')
const User = use('App/Models/User')
const Drive = use('Drive')
const Helpers = use('Helpers')

class AuthController {
  async init ({ response, request }) {
    var { method } = request.post()

    response.send(method)
  }

  async CreateUser (data) {
    try {

    } catch (error) {

    }
  }

  async Facebook ({ response, request }) {
    try {
      const token = request.header('fb_token')

      // Debug access token
      var tokenData = await axios.get('https://graph.facebook.com/v9.0/debug_token', {
        params: {
          'input_token': token,
          'access_token': "GG|"+Env.get('FB_APP_ID')+"|"+Env.get('FB_APP_SECRET'),
        }
      })

      tokenData = tokenData.data.data

      if(tokenData.is_valid && tokenData.app_id == Env.get('FB_APP_ID')) {

        // Get current user name from Facebook GG Graph
        var name = await axios.get('https://graph.fb.gg/v7.0/me?field=name', {
          params: { 'access_token': token }
        })

        name = name.data.name

        // Get current user photo from Facebook GG Graph
        var avatar = await axios.get('https://graph.fb.gg/v7.0/me/picture', {
          responseType: 'arraybuffer',
          params: { 'access_token': token }
        })

        avatar = avatar.data


        // Create user if not exists
        const user = await User.findOrCreate(
          { facebook: tokenData.user_id },
          { facebook_connected: true, facebook: tokenData.user_id, email_connected: false }
        )

        // Save photo
        await Drive.put(`${Helpers.publicPath()}/avatar/${user._id}.jpg`, Buffer.from(avatar))

        user.name = name
        user.photo = `${user._id}.jpg`
        user.save()

      } else {
        response.status(400).send({ error: "INVALID_FACEBOOK_ACCESS_TOKEN" })
      }
    } catch (error) {
      response.status(400).send({ error: "INVALID_FACEBOOK_ACCESS_TOKEN" })
    }

  }
}

module.exports = AuthController
