function Index({ params }: { params: { name: string } }) {
  console.log("params", params);
  return (
    <main className=" flex min-h-screen flex-col gap-6 p-24 mt-8 items-center">
      <div className="w-full max-w-3xl md:max-w-6xl flex flex-row justify-center gap-2">
        <div className="banner">
          <div className="con">
            <div className="banner_img">
              <img src="https://app.kiloex.io/static/png/1b1fd634.png" />
            </div>
          </div>
        </div>
        <div className="integral_info">
          <div className="title">Get points immediately</div>
          <div className="integral_con">
            <div className="integral_info_item signin">
              <div className="item1">
                <svg
                  data-v-271dc304=""
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    data-v-271dc304=""
                    d="M2.73161 8.85386L8.30996 14.8083L5.62376 8.85386H2.73161ZM10.0023 15.7664L13.1272 8.85386H6.87732L10.0023 15.7664ZM5.65062 7.70774L7.47724 4.2694H5.13129L2.55253 7.70774H5.65062ZM11.6946 14.8083L17.2729 8.85386H14.3808L11.6946 14.8083ZM6.94895 7.70774H13.0556L11.229 4.2694H8.77557L6.94895 7.70774ZM14.3539 7.70774H17.452L14.8732 4.2694H12.5273L14.3539 7.70774ZM15.6164 3.3561L19.0548 7.94055C19.1383 8.048 19.1771 8.17186 19.1712 8.31214C19.1652 8.45242 19.1145 8.5733 19.019 8.67478L10.4231 17.8437C10.3157 17.9631 10.1754 18.0228 10.0023 18.0228C9.82915 18.0228 9.68888 17.9631 9.58143 17.8437L0.985579 8.67478C0.890069 8.5733 0.83933 8.45242 0.833361 8.31214C0.827391 8.17186 0.866192 8.048 0.949763 7.94055L4.3881 3.3561C4.49555 3.20089 4.64777 3.12329 4.84476 3.12329H15.1598C15.3568 3.12329 15.509 3.20089 15.6164 3.3561Z"
                    fill="#389AFF"
                  ></path>
                </svg>
              </div>
              <div className="item2">
                <div className="sign_in_title">
                  <h2>
                    Activity Points | Trade for 7 consecutive days and earn 28
                    points.
                  </h2>
                  <span
                    data-v-271dc304=""
                    style={{
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <svg
                      data-v-271dc304=""
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="15"
                      viewBox="0 0 14 15"
                      fill="none"
                    >
                      <path
                        data-v-271dc304=""
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11.9625 6.00024L11.1375 5.17529L7.01272 9.30008L2.88793 5.17529L2.06297 6.00024L6.6002 10.5375C6.6002 10.5375 6.60024 10.5375 7.01272 10.125L6.6002 10.5375L7.01272 10.95L11.9625 6.00024Z"
                        fill="white"
                      ></path>
                    </svg>
                  </span>
                </div>
                <p data-v-271dc304="" className="desc">
                  Have traded for 0 consecutive days and earned 0 points
                </p>
              </div>
              <div className="item3">
                <a href="">
                  <button className="arco-btn arco-btn-primary arco-btn-shape-square arco-btn-size-medium arco-btn-status-normal">
                    Go to Trade
                  </button>
                </a>
              </div>
            </div>

            <div className="integral_info_item signin">
              <div className="item1">
                <svg
                  data-v-271dc304=""
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    data-v-271dc304=""
                    d="M2.73161 8.85386L8.30996 14.8083L5.62376 8.85386H2.73161ZM10.0023 15.7664L13.1272 8.85386H6.87732L10.0023 15.7664ZM5.65062 7.70774L7.47724 4.2694H5.13129L2.55253 7.70774H5.65062ZM11.6946 14.8083L17.2729 8.85386H14.3808L11.6946 14.8083ZM6.94895 7.70774H13.0556L11.229 4.2694H8.77557L6.94895 7.70774ZM14.3539 7.70774H17.452L14.8732 4.2694H12.5273L14.3539 7.70774ZM15.6164 3.3561L19.0548 7.94055C19.1383 8.048 19.1771 8.17186 19.1712 8.31214C19.1652 8.45242 19.1145 8.5733 19.019 8.67478L10.4231 17.8437C10.3157 17.9631 10.1754 18.0228 10.0023 18.0228C9.82915 18.0228 9.68888 17.9631 9.58143 17.8437L0.985579 8.67478C0.890069 8.5733 0.83933 8.45242 0.833361 8.31214C0.827391 8.17186 0.866192 8.048 0.949763 7.94055L4.3881 3.3561C4.49555 3.20089 4.64777 3.12329 4.84476 3.12329H15.1598C15.3568 3.12329 15.509 3.20089 15.6164 3.3561Z"
                    fill="#389AFF"
                  ></path>
                </svg>
              </div>
              <div className="item2">
                <div className="sign_in_title">
                  <h2>
                    Activity Points | Trade for 7 consecutive days and earn 28
                    points.
                  </h2>
                  <span
                    data-v-271dc304=""
                    style={{
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <svg
                      data-v-271dc304=""
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="15"
                      viewBox="0 0 14 15"
                      fill="none"
                    >
                      <path
                        data-v-271dc304=""
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11.9625 6.00024L11.1375 5.17529L7.01272 9.30008L2.88793 5.17529L2.06297 6.00024L6.6002 10.5375C6.6002 10.5375 6.60024 10.5375 7.01272 10.125L6.6002 10.5375L7.01272 10.95L11.9625 6.00024Z"
                        fill="white"
                      ></path>
                    </svg>
                  </span>
                </div>
                <p data-v-271dc304="" className="desc">
                  Have traded for 0 consecutive days and earned 0 points
                </p>
              </div>
              <div className="item3">
                <a href="">
                  <button className="arco-btn arco-btn-primary arco-btn-shape-square arco-btn-size-medium arco-btn-status-normal">
                    Go to Trade
                  </button>
                </a>
              </div>
            </div>
            <div className="integral_info_item signin">
              <div className="item1">
                <svg
                  data-v-271dc304=""
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    data-v-271dc304=""
                    d="M2.73161 8.85386L8.30996 14.8083L5.62376 8.85386H2.73161ZM10.0023 15.7664L13.1272 8.85386H6.87732L10.0023 15.7664ZM5.65062 7.70774L7.47724 4.2694H5.13129L2.55253 7.70774H5.65062ZM11.6946 14.8083L17.2729 8.85386H14.3808L11.6946 14.8083ZM6.94895 7.70774H13.0556L11.229 4.2694H8.77557L6.94895 7.70774ZM14.3539 7.70774H17.452L14.8732 4.2694H12.5273L14.3539 7.70774ZM15.6164 3.3561L19.0548 7.94055C19.1383 8.048 19.1771 8.17186 19.1712 8.31214C19.1652 8.45242 19.1145 8.5733 19.019 8.67478L10.4231 17.8437C10.3157 17.9631 10.1754 18.0228 10.0023 18.0228C9.82915 18.0228 9.68888 17.9631 9.58143 17.8437L0.985579 8.67478C0.890069 8.5733 0.83933 8.45242 0.833361 8.31214C0.827391 8.17186 0.866192 8.048 0.949763 7.94055L4.3881 3.3561C4.49555 3.20089 4.64777 3.12329 4.84476 3.12329H15.1598C15.3568 3.12329 15.509 3.20089 15.6164 3.3561Z"
                    fill="#389AFF"
                  ></path>
                </svg>
              </div>
              <div className="item2">
                <div className="sign_in_title">
                  <h2>
                    Activity Points | Trade for 7 consecutive days and earn 28
                    points.
                  </h2>
                  <span
                    data-v-271dc304=""
                    style={{
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <svg
                      data-v-271dc304=""
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="15"
                      viewBox="0 0 14 15"
                      fill="none"
                    >
                      <path
                        data-v-271dc304=""
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11.9625 6.00024L11.1375 5.17529L7.01272 9.30008L2.88793 5.17529L2.06297 6.00024L6.6002 10.5375C6.6002 10.5375 6.60024 10.5375 7.01272 10.125L6.6002 10.5375L7.01272 10.95L11.9625 6.00024Z"
                        fill="white"
                      ></path>
                    </svg>
                  </span>
                </div>
                <p data-v-271dc304="" className="desc">
                  Have traded for 0 consecutive days and earned 0 points
                </p>
              </div>
              <div className="item3">
                <a href="">
                  <button className="arco-btn arco-btn-primary arco-btn-shape-square arco-btn-size-medium arco-btn-status-normal">
                    Go to Trade
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Index;
