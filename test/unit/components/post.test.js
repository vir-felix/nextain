jest.mock('../../../src/entries')

import React from 'react'

import { load } from '../../../src/entries'
import withPost from '../../../src/components/post'

describe('withPost', () => {
  test('exports HOC withPost as default', () => {
    expect(withPost).toBeDefined()
  })

  test('withPost displayName wraps Component diplayName', () => {
    const Component = withPost(
      class Wrapped extends React.Component {
        static displayName = 'Wrapped'
      }
    )

    expect(Component.displayName).toEqual('WithPost(Wrapped)')
  })

  test('withPost hoist non react statics', () => {
    const Component = withPost(
      class Wrapped extends React.Component {
        static value = 'value'
      }
    )

    expect(Component.value).toEqual('value')
  })

  test('withPosts should add `post` property to getInitialProps', async () => {
    const expected = { data: {}, content: `` }
    const id = 'fake'
    const Component = withPost(({ post }) => (<div>Test</div>))

    load.mockReturnValueOnce([expected])
    const actual = await Component.getInitialProps({query: {__id: id}})

    expect(actual.post).toBeDefined()
    expect(actual.post).toEqual(expect.objectContaining(expected))
  })

  test('withPosts composes getInitialProps non react statics', async () => {
    const wrappedProps = { value: 1 }
    const getInitialProps = jest.fn().mockReturnValueOnce(wrappedProps)
    const id = 'fake'
    const expected = { data: { __id: id }, content: `` }
    
    load.mockReturnValueOnce([expected])

    const Component = withPost(
      class Wrapped extends React.Component {
        static getInitialProps = getInitialProps
  
        render () {
          return (<div>Test</div>)
        }
      }
    )
      
    const actual = await Component.getInitialProps({query: { __id: id}})

    expect(actual.value).toBeDefined()
    expect(actual.value).toEqual(1)

    expect(actual.post).toBeDefined()
    expect(actual.post).toEqual(expect.objectContaining(expected))
  })  
})

// describe('Content', () => {
//   test('exports Content', () => {
//     expect(Content).toBeDefined()
//   })

//   test('Content component should render post content', () => {
//     const expectedText = `lorem ipsum`
//     const expectedContent = h('root', [ h('p', expectedText) ])

//     unified.stringify.mockReturnValueOnce(<p>{expectedText}</p>)

//     const comp = renderer.create(<Content content={expectedContent} />)

//     expect(unified.runSync).toHaveBeenCalledWith(expectedContent)
//     expect(unified.stringify).toHaveBeenCalled()

//     expect(comp.toJSON()).toMatchSnapshot()
//   })
// })
