import { useEffect, useRef, useState } from "react";
import { Input, Button } from "antd";
import { PrinterOutlined, PlusCircleOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const formatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

function App() {
  const [total, setTotal] = useState<string>("");
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

  const print = () => {
    setItems(
      items.map((e, n) => ({
        ...e,
        price: formatter.format(Number.parseFloat(e.price)),
        total: formatter.format(Number.parseFloat(e.total)),
      }))
    );
    setTotal(formatter.format(Number.parseFloat(total)));
    setTimeout(() => window.print(), 500);
  };

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

  return (
    <>
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
            <tr>
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
                  rows={1}
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
                  placeholder="0 000 €"
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
                  placeholder="0 000 €"
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
      <Input className="input-sub-text" placeholder="Total" bordered={false} />
      <Input className="input-sub" placeholder="9 999 €" bordered={false} />
      <Input
        className="input-price-text"
        placeholder="Discount"
        bordered={false}
      />
      <Input className="input-price" placeholder="999 €" bordered={false} />
      <Input
        className="input-net"
        placeholder="9 000 €"
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
        src="/stamp.png"
        loading="eager"
        alt="Signature & stamp"
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
      <Button
        className="btn-print"
        shape="circle"
        size="large"
        style={{ width: 50, height: 50 }}
        icon={<PrinterOutlined style={{ fontSize: 30 }} />}
        onClick={print}
        disabled={!uid || !total || total === "NaN"}
      />
    </>
  );
}

export default App;
