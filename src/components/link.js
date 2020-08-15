/* global __NEXT_DATA__ */

import React, { Component } from 'react'
import Link from 'next/link'

import loadEntries from '../entries/load'
import entriesMap from '../entries/map'
import { prefixed } from '../entries/prefixed'

class NexteinLink extends Component {
  static getDerivedStateFromProps (state, { href, as }) {
    if (state.href !== href) {
      return { href, as }
    }
    return null
  }

  state = {
    href: this.props.href,
    as: this.props.as
  }

  async componentDidMount () {
    const { props } = __NEXT_DATA__
    let { _entriesMap: map } = (props.pageProps || props)

    if (!map) {
      const all = await loadEntries()
      map = await entriesMap(all)
    }
    this.setState({ mapped: true })

    const { href } = this.state
    if (href && map) {
      const entry = map[href]

      if (entry) {
        this.setState({
          href: { pathname: entry.pathname, query: entry.query },
          as: href
        })
      }
    }
  }

  render () {
    let { href, as, mapped } = this.state
    const { data, content, raw, ...rest } = this.props // content & raw are not used but required to remove them from rest

    if (data) {
      const { page = 'post', _entry, url } = data
      href = { pathname: `/${page}`, query: { _entry } }
      as = url
    }

    href = prefixed(href)
    as = prefixed(as)

    return (mapped ? <Link {...{ ...rest, href, as }} /> : null)
  }
}

export default NexteinLink
