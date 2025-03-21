import styles from "../PhotoEditor/PhotoEditor.module.scss";
import React, { useContext, useState } from "react";
import { Upload } from "antd";
import { TokenManager } from "utils";
import { UserContext } from "../../../../../core/contexts";

const PhotoEditor: React.FC = () => {
  const value = useContext(UserContext);
  // const dispatch = useDispatch()
  const token = TokenManager.getAccessToken();
  const [fileList, setFileList] = useState<any>([{ url: value?.photo_url }]);

  const onChange = ({ fileList: newFileList }: any): void => {
    setFileList(newFileList);
  };

  const onPreview = async (file: any) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow: any = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  return (
    <div className={styles.photo_upload}>
      <Upload
        action="https://demo.5gct.co/user/update_photo"
        headers={{ Authorization: `Bearer ${token}` }}
        listType="picture-card"
        fileList={fileList}
        onChange={onChange}
        onPreview={onPreview}
      >
        {fileList.length < 1 && "+ Upload"}
      </Upload>
    </div>
  );
};
export default PhotoEditor;
