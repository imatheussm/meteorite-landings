import pandas as pd
import requests as rq

data_frame = pd.read_csv("meteorite-landings.csv", index_col="id").sort_index()
access_token = "MAPBOX_ACCESS_TOKEN_HERE"

for index, row in data_frame.iterrows():
    latitude, longitude = row["reclat"], row["reclong"]
    url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{longitude},{latitude}.json?access_token={access_token}"

    while True:
        try:
            response, should_print = rq.get(url), True
            while response.status_code != 200:
                if should_print is True:
                    print(f"[{index}/{data_frame.index.max()}] Trying request again...", end="\r")
                    should_print = False

                response = rq.get(url)
            break
        except:
            print(f"[{index}/{data_frame.index.max()}] Some error happened!")
            continue

    print(f"[{index}/{data_frame.index.max()}] Saving data...", end="\r")

    features = dict(response.json())["features"]
    response.close()

    for feature in features:
        if "region" in feature["place_type"]:
            data_frame.loc[index, "region"] = feature["text"]
        if "country" in feature["place_type"]:
            data_frame.loc[index, "country"] = feature["text"]

data_frame.to_csv("new-meteorite-landings.csv")
