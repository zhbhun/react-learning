import React from 'react';

class HelloMessage extends React.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}

const Demo = () => <HelloMessage name="Taylor" />;
Demo.path = 'hello-message';
Demo.title = 'Hello Message';

export default Demo;
