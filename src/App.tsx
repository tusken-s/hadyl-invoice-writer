import { useEffect, useRef, useState } from "react";
import { Input, Button, Switch, Typography, Select } from "antd";
import {
  PrinterOutlined,
  PlusCircleOutlined,
  BranchesOutlined,
} from "@ant-design/icons";
import stamp from "./assets/stamp.png";
import BlancCover from "./assets/blanc.png";
import BillCover from "./assets/cover.png";

const { Paragraph } = Typography;
const { TextArea } = Input;

function App() {
  const cover = document.querySelector("#page-bg") as HTMLImageElement;

  // Bill or Blanc document
  const [mode, setMode] = useState<"BILL" | "BLANC">("BILL");

  // Blanc state
  const [titleText, setTitleText] = useState<string>("");
  const [bodyText, setBodyText] = useState<string>("");
  const [headText, setHeadText] = useState<string>("");

  // Bill state
  const [total, setTotal] = useState<string>("");
  const [currency, setCurrency] = useState<Intl.NumberFormat>(
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    })
  );
  const [accountBank, setAccountBank] = useState<string>("Attijari BANK");
  const [accountName, setAccountName] = useState<string>("Ste HADYL Consult");
  const [accountNb, setAccountNb] = useState<string>("04034120004048782978");
  const [accountSwift, setAccountSwift] = useState<string>("BSTUTNTT");
  const [items, setItems] = useState<
    {
      qty: string;
      desc: string;
      unit: string;
      price: string;
      total: string;
    }[]
  >([
    {
      qty: "",
      desc: "",
      unit: "",
      price: "",
      total: "",
    },
  ]);
  const [uid, setUid] = useState<string>("");

  useEffect(() => {
    cover.src = BillCover;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (uid) document.title = `Invoice #${uid}`;
  }, [uid]);

  const prevItems = useRef(items);
  useEffect(() => {
    if (
      JSON.stringify(prevItems) !== JSON.stringify(items) &&
      items.every((e) => e.qty && e.price)
    ) {
      prevItems.current = items;
      //calculate();
    }
  }, [items]);

  const print = () => {
    setItems(
      items.map((e) => ({
        ...e,
        price: currency.format(Number.parseFloat(e.price)),
        total: currency.format(Number.parseFloat(e.total)),
      }))
    );
    setTotal(currency.format(Number.parseFloat(total)));
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setUid("");
        setTotal("");
        setItems([
          {
            qty: "",
            desc: "",
            unit: "",
            price: "",
            total: "",
          },
        ]);
      }, 1000);
    }, 500);
  };

  const changeMode = () => {
    if (mode === "BILL") {
      cover.src = BlancCover;
      setMode("BLANC");
    } else {
      cover.src = BillCover;
      setMode("BILL");
    }
  };

  const changeCurrency = (currency: string) => {
    setCurrency(
      new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency,
      })
    );
  };

  return (
    <>
      {mode === "BILL" ? (
        <>
          <div className="t m0 x1 h2 y1 ff1 fs0 fc0 sc0 ls0 ws0 fw">
            Invoice
          </div>
          <div className="t m0 x2 h3 y2 ff1 fs1 fc0 sc0 ls0 ws0">Number #</div>
          <div className="t m0 x3 h4 y3 ff1 fs2 fc0 sc0 ls1 ws1">
            To<span className="_ _1"></span>:
          </div>
          <div className="t m0 x3 h4 y4 ff1 fs2 fc0 sc0 ls0 ws0">Date:</div>
          <span className="t-c-1">Qty</span>
          <span className="t-c-2">Description</span>
          <span className="t-c-3">Unit</span>
          <span className="t-c-4">Unit price</span>
          <span className="t-c-5">Amount</span>
          <div className="input-net-text">Net to pay</div>
          <div className="t m0 x6 h7 y7 ff3 fs1 fc1 sc0 ls0 ws0">
            SAP Integration - Maintenance - Support
          </div>
          <div className="t m0 x7 h8 y8 ff1 fs4 fc0 sc0 ls0 ws0">
            Payment Details
          </div>
          <div className="t m0 x7 h9 y9 ff4 fs4 fc0 sc0 ls0 ws0">
            <table className="fst">
              <tbody>
                <tr>
                  <th>Bank:</th>
                  <td>
                    <Paragraph
                      className="input-account"
                      editable={{
                        tooltip: "Cliquez pour modifier le nom de banque",
                        onChange: (x) => setAccountBank(x),
                      }}
                    >
                      {accountBank}
                    </Paragraph>
                  </td>
                </tr>
                <tr>
                  <th>Account Name:</th>
                  <td>
                    <Paragraph
                      className="input-account"
                      editable={{
                        tooltip: "Cliquez pour modifier le nom de compte",
                        onChange: (x) => setAccountName(x),
                      }}
                    >
                      {accountName}
                    </Paragraph>
                  </td>
                </tr>
                <tr>
                  <th>Account Number:</th>
                  <td>
                    <Paragraph
                      className="input-account"
                      editable={{
                        tooltip: "Cliquez pour modifier le numéro de compte",
                        onChange: (x) => setAccountNb(x),
                      }}
                    >
                      {accountNb}
                    </Paragraph>
                  </td>
                </tr>
                <tr>
                  <th>Swif Code:</th>
                  <td>
                    <Paragraph
                      className="input-account"
                      editable={{
                        tooltip: "Cliquez pour modifier le type de compte",
                        onChange: (x) => setAccountSwift(x),
                      }}
                    >
                      {accountSwift}
                    </Paragraph>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Input
            className="input-uid"
            placeholder="2021XXXXX"
            bordered={false}
            value={uid}
            onChange={(e) => setUid(e.target.value)}
          />
          <TextArea
            className="input-customer"
            placeholder="Ste Foulen Foulani"
            bordered={false}
            rows={3}
          />
          <Input
            className="input-date"
            placeholder="2021/01/01"
            bordered={false}
            defaultValue={new Date().toISOString().split("T")[0]}
          />
          <table className="input-items">
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td>
                    <Input
                      className="input-item-qty"
                      placeholder="x"
                      bordered={false}
                      value={item.qty}
                      onChange={(e) => {
                        setItems(
                          items.map((x, n) =>
                            n === i
                              ? {
                                  ...items[n],
                                  qty: e.target.value,
                                  total: `${(
                                    Number.parseFloat(x.price || "0") *
                                    Number.parseFloat(e.target.value)
                                  ).toFixed(2)}`,
                                }
                              : x
                          )
                        );
                        setTotal(
                          `${items
                            .reduce(
                              (t, x, n) =>
                                t +
                                Number.parseFloat(
                                  n === i ? e.target.value : x.qty
                                ) *
                                  Number.parseFloat(x.price),
                              0
                            )
                            .toFixed(2)}`
                        );
                      }}
                    />
                  </td>
                  <td>
                    <TextArea
                      className="input-item-desc"
                      placeholder="Item name and/or description"
                      bordered={false}
                      value={item.desc}
                      onChange={(e) =>
                        setItems(
                          items.map((x, n) =>
                            n === i ? { ...items[n], desc: e.target.value } : x
                          )
                        )
                      }
                    />
                  </td>
                  <td>
                    <Input
                      className="input-item-unit"
                      placeholder="pc"
                      bordered={false}
                      value={item.unit}
                      onChange={(e) =>
                        setItems(
                          items.map((x, n) =>
                            n === i ? { ...items[n], unit: e.target.value } : x
                          )
                        )
                      }
                    />
                  </td>
                  <td>
                    <Input
                      className="input-item-price"
                      placeholder={currency.format(0)}
                      bordered={false}
                      value={item.price}
                      onChange={(e) => {
                        setItems(
                          items.map((x, n) =>
                            n === i
                              ? {
                                  ...items[n],
                                  qty: x.qty || "1",
                                  price: e.target.value,
                                  total: `${(
                                    Number.parseFloat(x.qty || "1") *
                                    Number.parseFloat(e.target.value)
                                  ).toFixed(2)}`,
                                }
                              : x
                          )
                        );
                        setTotal(
                          `${items
                            .reduce(
                              (t, x, n) =>
                                t +
                                Number.parseFloat(x.qty) *
                                  Number.parseFloat(
                                    n === i ? e.target.value : x.price
                                  ),
                              0
                            )
                            .toFixed(2)}`
                        );
                      }}
                    />
                  </td>
                  <td>
                    <Input
                      className="input-item-total"
                      placeholder={currency.format(0)}
                      bordered={false}
                      value={item.total}
                      onChange={(e) =>
                        setItems(
                          items.map((x, n) =>
                            n === i ? { ...items[n], total: e.target.value } : x
                          )
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Input
            className="input-sub-text"
            placeholder="Total"
            bordered={false}
          />
          <Input
            className="input-sub"
            placeholder={currency.format(9999)}
            bordered={false}
          />
          <Input
            className="input-price-text"
            placeholder="Discount"
            bordered={false}
          />
          <Input
            className="input-price"
            placeholder={currency.format(999)}
            bordered={false}
          />
          <Input
            className="input-net"
            placeholder={currency.format(9000)}
            bordered={false}
            onChange={(e) => setTotal(e.target.value)}
            value={total}
          />
          <TextArea
            className="input-note"
            placeholder="More info"
            bordered={false}
            rows={4}
          />
          <img
            className="stamp"
            src={stamp}
            loading="eager"
            alt="Signature & stamp"
          />
          <Select
            className="currency"
            onChange={changeCurrency}
            value={currency.resolvedOptions().currency}
            options={[
              { label: "€ - Euro", value: "EUR" },
              { label: "$ - US Dollar", value: "USD" },
              { label: "£ - UK Pound", value: "GBP" },
              { label: "TND - Tunisian Dinar", value: "TND" },
              { label: "CHF - Swiss Franc", value: "CHF" },
            ]}
          />
          <Button
            className="btn-add-item"
            type="primary"
            shape="circle"
            size="large"
            icon={<PlusCircleOutlined />}
            onClick={() => {
              if (items.length < 6)
                setItems([
                  ...items,
                  {
                    qty: "",
                    desc: "",
                    unit: "",
                    price: "",
                    total: "",
                  },
                ]);
            }}
          />
        </>
      ) : (
        <>
          <Input
            className="text-title"
            placeholder="Titre de document"
            bordered={false}
            onChange={(e) => setTitleText(e.target.value)}
            value={titleText}
          />
          <TextArea
            className="text-body"
            placeholder="Contenu de document..."
            bordered={false}
            rows={15}
            onChange={(e) => setBodyText(e.target.value)}
            value={bodyText}
          />
          <TextArea
            className="text-note"
            placeholder="Adresse / Tél..."
            bordered={false}
            rows={4}
            onChange={(e) => setHeadText(e.target.value)}
            value={headText}
          />
        </>
      )}
      <Switch
        className="btn-mode"
        checkedChildren="Facture"
        unCheckedChildren="Papier vide"
        defaultChecked={mode === "BILL"}
        onChange={changeMode}
      />
      <Button
        className="btn-print"
        shape="circle"
        size="large"
        style={{ width: 50, height: 50 }}
        icon={<PrinterOutlined style={{ fontSize: 30 }} />}
        onClick={print}
        disabled={
          (mode === "BILL" && (!uid || !total || total === "NaN")) ||
          (mode === "BLANC" && (!titleText || !bodyText))
        }
      />
      <span className="version">
        <BranchesOutlined /> version: {require("../package.json").version}
      </span>
    </>
  );
}

export default App;
