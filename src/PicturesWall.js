import React, { Component } from "react";
import "antd/dist/antd.css";
import {
  Button,
  Input,
  Layout,
  Row,
  Col,
  message,
  Form,
  Icon,
  Alert,
  Upload,
  Modal
} from "antd";
import "./App.css";
import OSS from "ali-oss";

const { Header, Footer, Content } = Layout;

class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: "",
    fileList: []
  };

  componentDidMount() {
    this.getPicturesWallList();
  }

  timestamp = () => {
    const time = new Date();
    const y = time.getFullYear();
    const m = time.getMonth() + 1;
    const d = time.getDate();
    const h = time.getHours();
    const mm = time.getMinutes();
    const s = time.getSeconds();

    console.log(y);

    return (
      "" +
      y +
      this.add0(m) +
      this.add0(d) +
      this.add0(h) +
      this.add0(mm) +
      this.add0(s)
    );
  };

  add0 = m => {
    return m < 10 ? "0" + m : m;
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  handleChange = ({ fileList }) => {
    debugger;
    // UploadToOss(a, b);
    this.setState({ fileList });
  };

  handleRemove = file => {
    client.delete(file.name);
  };

  beforeUpload = file => {
    // If the type of this file is not image, return false
    if (file.type.split("/")[0] !== "image") {
      message.error('Please upload an image!');
      return false;
    }
    
    // Get suffix
    const suffix = file.type.split("/")[1] || "png";
    this.uploadToOss(file, suffix);
    return false;
  };

  getPicturesWallList = () => {
    client.list().then(result => {
      console.log("pictures wall list: ", result);
      const fileList = result.objects.map(item => {
        return {
          uid: item.etag,
          name: item.name,
          status: "done",
          url: item.url
        };
      });
      this.setState({
        fileList: fileList
      });
    });
  };

  uploadToOss = (file, suffix) => {
    // Generate image file name
    const storeAs = "upload-image." + this.timestamp() + '.' + suffix;

    client.multipartUpload(storeAs, file);
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <Layout>
        <Header style={{ minHeight: "5vh", margin: "0 0 10px 0" }}>
          <h1 style={{ color: "#ffffff" }}> Pictures Wall </h1>
        </Header>
        <Content style={{ minHeight: "87vh", margin: "0 16px" }}>
          <Upload
            beforeUpload={this.beforeUpload}
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            onRemove={this.handleRemove}
          >
            {fileList.length >= 10 ? null : uploadButton}
          </Upload>
          <Modal
            visible={previewVisible}
            footer={null}
            onCancel={this.handleCancel}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </Content>
        <Footer style={{ minHeight: "5vh" }}>
          © Welcome to the International - {new Date().getFullYear()}
        </Footer>
      </Layout>
    );
  }
}

const client = new OSS.Wrapper({
  accessKeyId: "LTAIZXHNFG7NLgXN",
  accessKeySecret: "VTapsCthhZ8joqlJZ8nO7KfOW8HEpO",
  region: "oss-us-east-1",
  bucket: "pictures-wall"
});

export default PicturesWall;
