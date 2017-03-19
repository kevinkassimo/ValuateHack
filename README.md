# ValuateHack
### A tool to remove non-customer price search daily limit 

A very simple hack on a domain price evaluation site Valuate.com (which internally using domain price evaluation algorithms by Estibot.com). Using PhantomJS.  

### How to use  
Rename "sample_config.json" to __"config.json"__.  
Enter your username (email) and password at the correct place.  
Enter all the domains you want to check inside the [] (brackets) after "domain", e.g.  
```
"domain": ["domain1.com", "domain2.com", "domain3.com"]
```
"timeout" specifies polling time. If you are having a large number of domains to query, increase the number of "timeout". (The program has a chance to fail if "timeout" is too small, but bigger timeout means longer time to wait before generating data)  
"priceonly": set it to 0 if you only want domain \+ price to be listed in the final result.  

### Run
Open __Terminal__, install __phantomjs__ (you can check yourself or ask someone who know very basic coding to help you install), go to the directory using terminal, then type:
```
phantomjs valuate_search.js
```

Generated report will be in "report.txt".