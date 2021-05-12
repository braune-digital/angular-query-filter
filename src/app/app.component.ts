import { Component, OnInit } from "@angular/core";
import { ParamFilter } from "../../lib/src/utils/paramfilter.class";
import { HttpClient } from "@angular/common/http";
import { TextFilter } from "../../lib/src/utils/filter/types/text.filter";
import { defineLocale } from "ngx-bootstrap/chronos";
import { deLocale } from "ngx-bootstrap/locale";

defineLocale("de", deLocale);

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "app";

  filter: ParamFilter;
  data: any;

  constructor(private _api: HttpClient) {
    this.filter = new ParamFilter(
      "https://jsonplaceholder.typicode.com/posts",
      this._api
    );
    this.filter.responseEvent.subscribe((_data: Array<any>) => {
      this.data = _data;
    });

    this.filter.add(new TextFilter(["title"], "", "search"));
  }

  ngOnInit(): void {
    this.filter.refresh();
  }
}
