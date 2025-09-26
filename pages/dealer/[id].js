import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
// import { API_URL } from "../../../config";
import router from "next/router";
import {
  Radio,
  Button,
  Select,
  Card,
  message,
  Divider,
  Form,
  Input,
} from "antd";
import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";
import { useRouter } from "next/router";

import Link from "next/link";

const Default = () => {
  const intl = useIntl();
  const [state, seTstate] = useState({});
  const [displaySave, seTdisplaySave] = useState(true);
  const [fields, seTfields] = useState(
    Object.entries(state).map(([name, value]) => ({ name, value }))
  );

  const { user } = useSelector(({ login }) => login);
  const [form] = Form.useForm();
  const router = useRouter();
  const { id } = router.query;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 24 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
    },
    labelAlign: "left",
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

  function getDataFc() {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/dealer/${id}`)
      .then((response) => {
        seTstate(response.data);
        seTfields(
          Object.entries(response.data).map(([name, value]) => ({
            name,
            value,
          }))
        );
      });
  }

  useEffect(() => {
    // getDataCategory();
    getDataFc();
  }, []);

  const onSubmit = async (Data) => {
    if (Data["otherState"]) {
      Data["state"] = Data["otherState"];
    }

    axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/dealer/${id}`, Data)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error("Dealer not Updated" + res.data.messagge);
        } else {
          message.success("Dealer Updated Successfully");
          router.push("/dealer/list");
        }
      })
      .catch((err) => {
        console.log(err);
        message.error(err.response.data.message);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

  return (
    <div>
      <Link href="/dealer/list">
        <Button type="primary" style={{ marginBottom: 16 }}>
          Back to List
        </Button>
      </Link>
      <Card className="card" title={"Dealer Edit"}>
        <Form
          {...formItemLayout}
          form={form}
          name="add"
          onFinishFailed={onFinishFailed}
          onFinish={onSubmit}
          fields={fields}
          scrollToFirstError
        >
          <Form.Item
            name="name"
            label={"Name"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                name: e.target.value,
              });
            }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label={"Email"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                email: e.target.value,
              });
            }}
          >
            <Input type="email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label={"Phone"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
              {
                pattern: /^[0-9]{10}$/,
                message: "Please enter a valid phone number",
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                mobile: e.target.value,
              });
            }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="gender"
            label={"Gender"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Select
              onChange={(value) => {
                seTstate({
                  ...state,
                  gender: value,
                });
              }}
            >
              <Select.Option value="MALE">Male</Select.Option>
              <Select.Option value="FEMALE">Female</Select.Option>
              <Select.Option value="PREFER_NOT_TO_SAY">
                PREFER NOT TO SAY
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="age"
            label={"Age"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                age: e.target.value,
              });
            }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="education_details"
            label={"Educational Details"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                education_details: e.target.value,
              });
            }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label={"Address"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Input.TextArea
              onChange={(e) => {
                seTstate({
                  ...state,
                  address: e.target.value,
                });
              }}
            />
          </Form.Item>

          <Form.Item
            name="district"
            label={"District"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                district: e.target.value,
              });
            }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="state"
            label={"State"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                state: e.target.value,
              });
            }}
          >
            <Radio.Group
              value={state.state}
              onChange={(e) => {
                seTstate({
                  ...state,
                  state: e.target.value,
                });
              }}
            >
              <Radio value="tamilnadu">TAMILNADU</Radio>
              <Radio value="kerala">KERALA</Radio>
              <Radio value="karnataka">KARNATAKA</Radio>
              <Radio value="andhrapradesh">ANDHRAPRADESH</Radio>
              <Radio value="telangana">TELANGANA</Radio>
              <Radio value="puducherry">PUDUCHERRY</Radio>
              <Radio value="others">OTHERS</Radio>
            </Radio.Group>
          </Form.Item>

          {state.state === "others" && (
            <Form.Item
              name="otherState"
              label={"Enter Your State Name"}
              rules={[
                {
                  required: true,
                  message: "Please enter your state",
                },
              ]}
            >
              <Input />
            </Form.Item>
          )}

          <Form.Item
            name="dealership_place"
            label={"Place of Dealership"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                dealership_place: e.target.value,
              });
            }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="existing_business"
            label={"Do You Have Any Existing Business ?"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                existing_business: e.target.value,
              });
            }}
          >
            <Radio.Group
              value={state.state}
              onChange={(e) => {
                seTstate({
                  ...state,
                  existing_business: e.target.value,
                });
              }}
            >
              <Radio value="yes">YES</Radio>
              <Radio value="no">NO</Radio>
            </Radio.Group>
          </Form.Item>

          {state.existing_business === "yes" && (
            <>
              <Form.Item
                name="nature_of_business"
                label={"Nature of Business"}
                rules={[
                  {
                    required: true,
                    message: intl.messages["app.pages.common.pleaseFill"],
                  },
                ]}
                onChange={(e) => {
                  seTstate({
                    ...state,
                    nature_of_business: e.target.value,
                  });
                }}
              >
                <Radio.Group
                  value={state.state}
                  onChange={(e) => {
                    seTstate({
                      ...state,
                      nature_of_business: e.target.value,
                    });
                  }}
                >
                  <Radio value="automotive_business">AUTOMOTIVE BUSINESS</Radio>
                  <Radio value="non_automotive_business">
                    NON AUTOMOTIVE BUSINESS
                  </Radio>
                </Radio.Group>
              </Form.Item>

              {state.nature_of_business === "automotive_business" && (
                <>
                  <Form.Item
                    name="years_in_automotive_business"
                    label={"NO OF YEARS IN AUTOMOTIVE BUSINESS"}
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                    onChange={(e) => {
                      seTstate({
                        ...state,
                        years_in_automotive_business: e.target.value,
                      });
                    }}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="annual_average_sales_volume"
                    label={"ANNUAL AVERAGE SALES VOLUME (in numbers)"}
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                    onChange={(e) => {
                      seTstate({
                        ...state,
                        annual_average_sales_volume: e.target.value,
                      });
                    }}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="average_monthly_service_reporting"
                    label={"AVERAGE MONTHLY SERVICE REPORTING (in numbers)"}
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                    onChange={(e) => {
                      seTstate({
                        ...state,
                        average_monthly_service_reporting: e.target.value,
                      });
                    }}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="average_parts_in_business"
                    label={"AVERAGE PARTS IN BUSINESS (in lakhs)"}
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                    onChange={(e) => {
                      seTstate({
                        ...state,
                        average_parts_in_business: e.target.value,
                      });
                    }}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="investment_amount"
                    label={"INVESTMENT AMOUNT"}
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                    onChange={(e) => {
                      seTstate({
                        ...state,
                        investment_amount: e.target.value,
                      });
                    }}
                  >
                    <Radio.Group
                      value={state.state}
                      onChange={(e) => {
                        seTstate({
                          ...state,
                          investment_amount: e.target.value,
                        });
                      }}
                    >
                      <Radio value="non_metros">
                        NON-METROS (40 to 50 lakhs)
                      </Radio>
                      <Radio value="metros">METROS (50 to 60 lakhs)</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    name="source_of_investment"
                    label={"SOURCE OF INVESTMENT"}
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                    onChange={(e) => {
                      seTstate({
                        ...state,
                        source_of_investment: e.target.value,
                      });
                    }}
                  >
                    <Radio.Group
                      value={state.state}
                      onChange={(e) => {
                        seTstate({
                          ...state,
                          source_of_investment: e.target.value,
                        });
                      }}
                    >
                      <Radio value="loan">LOAN</Radio>
                      <Radio value="own_funds">OWN FUNDS</Radio>
                      <Radio value="combined">COMBINED</Radio>
                    </Radio.Group>
                  </Form.Item>
                  {state.source_of_investment === "loan" ||
                  state.source_of_investment === "combined" ? (
                    <>
                      <Form.Item
                        name="percent_contribution_for_capital"
                        label={"% OF CONTRIBUTION FOR CAPITAL (OWN AND LOAN)"}
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                        onChange={(e) => {
                          seTstate({
                            ...state,
                            percent_contribution_for_capital: e.target.value,
                          });
                        }}
                      >
                        <Input type="number" />
                      </Form.Item>
                      <Form.Item
                        name="level_of_interest_in_starting_new_business"
                        label={
                          "YOUR LEVEL OF INTEREST IN STARTING NEW BUSINESS"
                        }
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                      >
                        <Input.TextArea
                          onChange={(e) => {
                            seTstate({
                              ...state,
                              level_of_interest_in_starting_new_business:
                                e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        name="explain_why_dealership"
                        label={"EXPLAIN WHY YOU WANTED DEALERSHIP (in detail)"}
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                      >
                        <Input.TextArea
                          onChange={(e) => {
                            seTstate({
                              ...state,
                              explain_why_dealership: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        name="why_successful"
                        label={"WHY DO YOU THINK YOU WILL BE SUCCESSFUL ?"}
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                        onChange={(e) => {
                          seTstate({
                            ...state,
                            why_successful: e.target.value,
                          });
                        }}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name="setup_dealership_timing"
                        label={"HOW SOON YOU WANT TO SETUP DEALERSHIP ?"}
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                        onChange={(e) => {
                          seTstate({
                            ...state,
                            setup_dealership_timing: e.target.value,
                          });
                        }}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name="ready_to_invest"
                        label={"ARE YOU READY TO INVEST?"}
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                        onChange={(e) => {
                          seTstate({
                            ...state,
                            ready_to_invest: e.target.value,
                          });
                        }}
                      >
                        <Radio.Group
                          value={state.state}
                          onChange={(e) => {
                            seTstate({
                              ...state,
                              ready_to_invest: e.target.value,
                            });
                          }}
                        >
                          <Radio value="yes">YES</Radio>
                          <Radio value="no">NO</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        name="suggestions_comments"
                        label={"ANY OTHER SUGGESTIONS / COMMENTS"}
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                      >
                        <Input.TextArea
                          onChange={(e) => {
                            seTstate({
                              ...state,
                              suggestions_comments: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </>
                  ) : (
                    <>
                      <Form.Item
                        name="level_of_interest_in_starting_new_business"
                        label={
                          "YOUR LEVEL OF INTEREST IN STARTING NEW BUSINESS"
                        }
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                      >
                        <Input.TextArea
                          onChange={(e) => {
                            seTstate({
                              ...state,
                              level_of_interest_in_starting_new_business:
                                e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        name="explain_why_dealership"
                        label={"EXPLAIN WHY YOU WANTED DEALERSHIP (in detail)"}
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                      >
                        <Input.TextArea
                          onChange={(e) => {
                            seTstate({
                              ...state,
                              explain_why_dealership: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        name="why_successful"
                        label={"WHY DO YOU THINK YOU WILL BE SUCCESSFUL ?"}
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                        onChange={(e) => {
                          seTstate({
                            ...state,
                            why_successful: e.target.value,
                          });
                        }}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name="setup_dealership_timing"
                        label={"HOW SOON YOU WANT TO SETUP DEALERSHIP ?"}
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                        onChange={(e) => {
                          seTstate({
                            ...state,
                            setup_dealership_timing: e.target.value,
                          });
                        }}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name="ready_to_invest"
                        label={"ARE YOU READY TO INVEST?"}
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                        onChange={(e) => {
                          seTstate({
                            ...state,
                            ready_to_invest: e.target.value,
                          });
                        }}
                      >
                        <Radio.Group
                          value={state.state}
                          onChange={(e) => {
                            seTstate({
                              ...state,
                              ready_to_invest: e.target.value,
                            });
                          }}
                        >
                          <Radio value="true">YES</Radio>
                          <Radio value="false">NO</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        name="suggestions_comments"
                        label={"ANY OTHER SUGGESTIONS / COMMENTS"}
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                      >
                        <Input.TextArea
                          onChange={(e) => {
                            seTstate({
                              ...state,
                              suggestions_comments: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </>
                  )}
                </>
              )}

              {state.nature_of_business === "non_automotive_business" && (
                <>
                  {" "}
                  <Form.Item
                    name="existing_business_name"
                    label={"EXISTING BUSINESS & NAME OF BUSINESS UNIT"}
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                  >
                    <Input.TextArea
                      onChange={(e) => {
                        seTstate({
                          ...state,
                          existing_business_name: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="place_of_business_unit"
                    label={"PLACE OF BUSNIESS UNIT"}
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                    onChange={(e) => {
                      seTstate({
                        ...state,
                        place_of_business_unit: e.target.value,
                      });
                    }}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="products_dealing_with"
                    label={"PRODUCTS YOUR DEALING WITH"}
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                    onChange={(e) => {
                      seTstate({
                        ...state,
                        products_dealing_with: e.target.value,
                      });
                    }}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="years_in_current_business"
                    label={
                      "NUMBER OF YEARS IN CURRENT BUSINESS (in years) & ANNUAL TURNOVER (in lakhs)"
                    }
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                    onChange={(e) => {
                      seTstate({
                        ...state,
                        years_in_current_business: e.target.value,
                      });
                    }}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="existing_line_of_business"
                    label={"EXISTING LINE OF BUSINESS"}
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                    onChange={(e) => {
                      seTstate({
                        ...state,
                        existing_line_of_business: e.target.value,
                      });
                    }}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="investment_amount"
                    label={"INVESTMENT AMOUNT"}
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                    onChange={(e) => {
                      seTstate({
                        ...state,
                        investment_amount: e.target.value,
                      });
                    }}
                  >
                    <Radio.Group
                      value={state.state}
                      onChange={(e) => {
                        seTstate({
                          ...state,
                          investment_amount: e.target.value,
                        });
                      }}
                    >
                      <Radio value="non_metros">
                        NON-METROS (40 to 50 lakhs)
                      </Radio>
                      <Radio value="metros">METROS (50 to 60 lakhs)</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    name="source_of_investment"
                    label={"SOURCE OF INVESTMENT"}
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                    onChange={(e) => {
                      seTstate({
                        ...state,
                        source_of_investment: e.target.value,
                      });
                    }}
                  >
                    <Radio.Group
                      value={state.state}
                      onChange={(e) => {
                        seTstate({
                          ...state,
                          source_of_investment: e.target.value,
                        });
                      }}
                    >
                      <Radio value="loan">LOAN</Radio>
                      <Radio value="own_funds">OWN FUNDS</Radio>
                      <Radio value="combined">COMBINED</Radio>
                    </Radio.Group>
                  </Form.Item>
                  {state.source_of_investment === "loan" ||
                  state.source_of_investment === "combined" ? (
                    <>
                      <Form.Item
                        name="percent_contribution_for_capital"
                        label={"% OF CONTRIBUTION FOR CAPITAL (OWN AND LOAN)"}
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                        onChange={(e) => {
                          seTstate({
                            ...state,
                            percent_contribution_for_capital: e.target.value,
                          });
                        }}
                      >
                        <Input type="number" />
                      </Form.Item>
                      <Form.Item
                        name="level_of_interest_in_starting_new_business"
                        label={
                          "YOUR LEVEL OF INTEREST IN STARTING NEW BUSINESS"
                        }
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                      >
                        <Input.TextArea
                          onChange={(e) => {
                            seTstate({
                              ...state,
                              level_of_interest_in_starting_new_business:
                                e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        name="explain_why_dealership"
                        label={"EXPLAIN WHY YOU WANTED DEALERSHIP (in detail)"}
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                      >
                        <Input.TextArea
                          onChange={(e) => {
                            seTstate({
                              ...state,
                              explain_why_dealership: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        name="why_successful"
                        label={"WHY DO YOU THINK YOU WILL BE SUCCESSFUL ?"}
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                        onChange={(e) => {
                          seTstate({
                            ...state,
                            why_successful: e.target.value,
                          });
                        }}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name="setup_dealership_timing"
                        label={"HOW SOON YOU WANT TO SETUP DEALERSHIP ?"}
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                        onChange={(e) => {
                          seTstate({
                            ...state,
                            setup_dealership_timing: e.target.value,
                          });
                        }}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name="ready_to_invest"
                        label={"ARE YOU READY TO INVEST?"}
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                        onChange={(e) => {
                          seTstate({
                            ...state,
                            ready_to_invest: e.target.value,
                          });
                        }}
                      >
                        <Radio.Group
                          value={state.state}
                          onChange={(e) => {
                            seTstate({
                              ...state,
                              ready_to_invest: e.target.value,
                            });
                          }}
                        >
                          <Radio value="true">YES</Radio>
                          <Radio value="false">NO</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        name="suggestions_comments"
                        label={"ANY OTHER SUGGESTIONS / COMMENTS"}
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                      >
                        <Input.TextArea
                          onChange={(e) => {
                            seTstate({
                              ...state,
                              suggestions_comments: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </>
                  ) : (
                    <>
                      <Form.Item
                        name="level_of_interest_in_starting_new_business"
                        label={
                          "YOUR LEVEL OF INTEREST IN STARTING NEW BUSINESS"
                        }
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                      >
                        <Input.TextArea
                          onChange={(e) => {
                            seTstate({
                              ...state,
                              level_of_interest_in_starting_new_business:
                                e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        name="explain_why_dealership"
                        label={"EXPLAIN WHY YOU WANTED DEALERSHIP (in detail)"}
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                      >
                        <Input.TextArea
                          onChange={(e) => {
                            seTstate({
                              ...state,
                              explain_why_dealership: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        name="why_successful"
                        label={"WHY DO YOU THINK YOU WILL BE SUCCESSFUL ?"}
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                        onChange={(e) => {
                          seTstate({
                            ...state,
                            why_successful: e.target.value,
                          });
                        }}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name="setup_dealership_timing"
                        label={"HOW SOON YOU WANT TO SETUP DEALERSHIP ?"}
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                        onChange={(e) => {
                          seTstate({
                            ...state,
                            setup_dealership_timing: e.target.value,
                          });
                        }}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name="ready_to_invest"
                        label={"ARE YOU READY TO INVEST?"}
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                        onChange={(e) => {
                          seTstate({
                            ...state,
                            ready_to_invest: e.target.value,
                          });
                        }}
                      >
                        <Radio.Group
                          value={state.state}
                          onChange={(e) => {
                            seTstate({
                              ...state,
                              ready_to_invest: e.target.value,
                            });
                          }}
                        >
                          <Radio value="true">YES</Radio>
                          <Radio value="false">NO</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        name="suggestions_comments"
                        label={"ANY OTHER SUGGESTIONS / COMMENTS"}
                        rules={[
                          {
                            required: true,
                            message:
                              intl.messages["app.pages.common.pleaseFill"],
                          },
                        ]}
                      >
                        <Input.TextArea
                          onChange={(e) => {
                            seTstate({
                              ...state,
                              suggestions_comments: e.target.value,
                            });
                          }}
                        />
                      </Form.Item>
                    </>
                  )}
                </>
              )}
            </>
          )}

          {state.existing_business === "no" && (
            <>
              {" "}
              <Form.Item
                name="investment_amount"
                label={"INVESTMENT AMOUNT"}
                rules={[
                  {
                    required: true,
                    message: intl.messages["app.pages.common.pleaseFill"],
                  },
                ]}
                onChange={(e) => {
                  seTstate({
                    ...state,
                    investment_amount: e.target.value,
                  });
                }}
              >
                <Radio.Group
                  value={state.state}
                  onChange={(e) => {
                    seTstate({
                      ...state,
                      investment_amount: e.target.value,
                    });
                  }}
                >
                  <Radio value="non_metros">NON-METROS (40 to 50 lakhs)</Radio>
                  <Radio value="metros">METROS (50 to 60 lakhs)</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                name="source_of_investment"
                label={"SOURCE OF INVESTMENT"}
                rules={[
                  {
                    required: true,
                    message: intl.messages["app.pages.common.pleaseFill"],
                  },
                ]}
                onChange={(e) => {
                  seTstate({
                    ...state,
                    source_of_investment: e.target.value,
                  });
                }}
              >
                <Radio.Group
                  value={state.state}
                  onChange={(e) => {
                    seTstate({
                      ...state,
                      source_of_investment: e.target.value,
                    });
                  }}
                >
                  <Radio value="loan">LOAN</Radio>
                  <Radio value="own_funds">OWN FUNDS</Radio>
                  <Radio value="combined">COMBINED</Radio>
                </Radio.Group>
              </Form.Item>
              {state.source_of_investment === "loan" ||
              state.source_of_investment === "combined" ? (
                <>
                  <Form.Item
                    name="percent_contribution_for_capital"
                    label={"% OF CONTRIBUTION FOR CAPITAL (OWN AND LOAN)"}
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                    onChange={(e) => {
                      seTstate({
                        ...state,
                        percent_contribution_for_capital: e.target.value,
                      });
                    }}
                  >
                    <Input type="number" />
                  </Form.Item>
                  <Form.Item
                    name="level_of_interest_in_starting_new_business"
                    label={"YOUR LEVEL OF INTEREST IN STARTING NEW BUSINESS"}
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                  >
                    <Input.TextArea
                      onChange={(e) => {
                        seTstate({
                          ...state,
                          level_of_interest_in_starting_new_business:
                            e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="explain_why_dealership"
                    label={"EXPLAIN WHY YOU WANTED DEALERSHIP (in detail)"}
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                  >
                    <Input.TextArea
                      onChange={(e) => {
                        seTstate({
                          ...state,
                          explain_why_dealership: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="why_successful"
                    label={"WHY DO YOU THINK YOU WILL BE SUCCESSFUL ?"}
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                    onChange={(e) => {
                      seTstate({
                        ...state,
                        why_successful: e.target.value,
                      });
                    }}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="setup_dealership_timing"
                    label={"HOW SOON YOU WANT TO SETUP DEALERSHIP ?"}
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                    onChange={(e) => {
                      seTstate({
                        ...state,
                        setup_dealership_timing: e.target.value,
                      });
                    }}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="ready_to_invest"
                    label={"ARE YOU READY TO INVEST?"}
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                    onChange={(e) => {
                      seTstate({
                        ...state,
                        ready_to_invest: e.target.value,
                      });
                    }}
                  >
                    <Radio.Group
                      value={state.state}
                      onChange={(e) => {
                        seTstate({
                          ...state,
                          ready_to_invest: e.target.value,
                        });
                      }}
                    >
                      <Radio value="true">YES</Radio>
                      <Radio value="false">NO</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    name="suggestions_comments"
                    label={"ANY OTHER SUGGESTIONS / COMMENTS"}
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                  >
                    <Input.TextArea
                      onChange={(e) => {
                        seTstate({
                          ...state,
                          suggestions_comments: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </>
              ) : (
                <>
                  <Form.Item
                    name="level_of_interest_in_starting_new_business"
                    label={"YOUR LEVEL OF INTEREST IN STARTING NEW BUSINESS"}
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                  >
                    <Input.TextArea
                      onChange={(e) => {
                        seTstate({
                          ...state,
                          level_of_interest_in_starting_new_business:
                            e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="explain_why_dealership"
                    label={"EXPLAIN WHY YOU WANTED DEALERSHIP (in detail)"}
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                  >
                    <Input.TextArea
                      onChange={(e) => {
                        seTstate({
                          ...state,
                          explain_why_dealership: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="why_successful"
                    label={"WHY DO YOU THINK YOU WILL BE SUCCESSFUL ?"}
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                    onChange={(e) => {
                      seTstate({
                        ...state,
                        why_successful: e.target.value,
                      });
                    }}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="setup_dealership_timing"
                    label={"HOW SOON YOU WANT TO SETUP DEALERSHIP ?"}
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                    onChange={(e) => {
                      seTstate({
                        ...state,
                        setup_dealership_timing: e.target.value,
                      });
                    }}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="ready_to_invest"
                    label={"ARE YOU READY TO INVEST?"}
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                    onChange={(e) => {
                      seTstate({
                        ...state,
                        ready_to_invest: e.target.value,
                      });
                    }}
                  >
                    <Radio.Group
                      value={state.state}
                      onChange={(e) => {
                        seTstate({
                          ...state,
                          ready_to_invest: e.target.value,
                        });
                      }}
                    >
                      <Radio value="true">YES</Radio>
                      <Radio value="false">NO</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    name="suggestions_comments"
                    label={"ANY OTHER SUGGESTIONS / COMMENTS"}
                    rules={[
                      {
                        required: true,
                        message: intl.messages["app.pages.common.pleaseFill"],
                      },
                    ]}
                  >
                    <Input.TextArea
                      onChange={(e) => {
                        seTstate({
                          ...state,
                          suggestions_comments: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </>
              )}
            </>
          )}

          <Divider />
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" disabled={!displaySave}>
              update
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Default;
