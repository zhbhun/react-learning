## 挂载

- constructor() >> static getDerivedStateFromProps() >> render() >> componentDidMount()
- constructor() >> componentWillMount() >> render() >> componentDidMount()

## 更新

- componentWillReceiveProps() >> shouldComponentUpdate() >> componentWillUpdate() >> render() >> componentDidUpdate()
- shouldComponentUpdate() >> componentWillUpdate() >> render() >> componentDidUpdate()
- static getDerivedStateFromProps() >> shouldComponentUpdate() >> render() >> getSnapshotBeforeUpdate() >> componentDidUpdate()

## 卸载

- componentWillUnmount()

## 错误

- [Introducing Error Boundaries](https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html#introducing-error-boundaries)
- [componentDidCatch()](https://reactjs.org/docs/react-component.html#componentdidcatch)

## 常见问题

- getDerivedStateFromProps 不能和旧的生命周期韩式一起使用（旧的生命周期不会被调用）；
- componentDidCatch 只能捕获子节点的异常，而且异常必须是在生命周期函数里抛出的；

## 参考文献

- https://github.com/wojtekmaj/react-lifecycle-methods-diagram
- [React Native 中组件的生命周期](https://race604.com/react-native-component-lifecycle)
- [Understanding the React Component Lifecycle](http://busypeoples.github.io/post/react-component-lifecycle/)
