from flask import Flask, redirect, url_for, render_template, request
import pandas as pd

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        content = request.form["nm"]
        # Lấy thời gian hiện tại
        # Lưu dữ liệu và thời gian vào tệp CSV
        df = pd.DataFrame({"content": [content],})
        df.to_csv("data.csv", mode="a", header=False, index=False)
    return render_template("index.html")

@app.route("/stats")
def stats():
    # Đọc dữ liệu từ tệp CSV
    df = pd.read_csv("data.csv", names=["content", "timestamp"], parse_dates=["timestamp"])
    # Thực hiện một số hàm aggregate
    count = df["content"].value_counts()
    mean_length = df["content"].str.len().mean()
    max_length = df["content"].str.len().max()
    min_length = df["content"].str.len().min()
    std_length = df["content"].str.len().std()
    top_10 = count.head(10).to_dict()
    
    # Create JavaScript string from dictionary
    js_top_10 = "{"
    for idx, (key, value) in enumerate(top_10.items()):
        js_top_10 += f'"Top Content {idx + 1}": {value}'
        if idx < len(top_10) - 1:
            js_top_10 += ', '
    js_top_10 += "}"
    
    return render_template("stats.html", count=count.to_dict(), mean_length=mean_length, max_length=max_length, min_length=min_length, std_length=std_length, top_10=top_10, js_top_10 = js_top_10)

if __name__ == "__main__":
    app.run(debug=True)