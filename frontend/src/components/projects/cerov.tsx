/* eslint-disable react-hooks/rules-of-hooks */
import React, { useReducer } from "react";
import { useEffect, useState } from "react";
import {
  useColorModeValue,
  Input,
  Box,
  VStack,
  Text,
  HStack,
  Textarea,
  Button,
  AlertTitle,
  AlertDescription,
  AlertIcon,
  Alert,
} from "@chakra-ui/react";
import { toast } from "react-toastify";
import Toast from "../../components/Toast";
import Project from "../../types/project";
import Select from "react-select";
import { getAccountInfo } from "../../utils/MsGraphApiCall";
import DatePicker from "react-datepicker";
import isEqual from "lodash/isEqual";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import moment from "moment";

import { Table, Uploader } from "rsuite";
import { Submission, SubmissionWithChildren } from "../../types/submission";
import { RestAPI } from "../../api/rest";

var PH1: any[] = [];
var Companies: any[] = [];
var VendorsNames: any[] = [];
var BUs: any[] = [];
var CampaignChannel: any[] = [];
var TargetAudience: any[] = [];
var Budget: any[] = [];
var ExchangeRates: any[] = [];
var FiscalQuarter: any[] = [];
var Year: any[] = [];
var ProjectStartQuarter: any[] = [];

const { Column, HeaderCell, Cell } = Table;

interface Props {
  history: any;
  project: Project;
  submission?: any;
  children?: any[];
  isDraft?: boolean;
}

export default function Cerov(props: Props) {
  const [requestorsCompanyName, setRequestorsCompanyName] = useState<any>({
    label: "",
    value: { name: "", code: "", country: "" },
  });
  const [localExchangeRate, setLocalExchangeRate] = useState(0.0);
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [campaignChannel, setCampaignChannel] = useState<any>({
    label: "",
    value: "",
  });
  const [vendorName, setVendorName] = useState<any>({});
  const [year, setYear] = useState<any>({
    label: "",
    value: "",
  });
  const [projectStartQuarter, setProjectStartQuarter] = useState<any>({
    label: "",
    value: "",
  });
  const [projectNumber, setProjectNumber] = useState("");
  const [requestorsName, setRequestorsName] = useState("");
  const [projectApproval, setProjectApproval] = useState("");
  const [fiscalQuarter, setFiscalQuarter] = useState<any>({
    label: "",
    value: "",
  });
  const [organizingCompany, setOrganizingCompany] = useState("");
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [budgetSource, setBudgetSource] = useState<any>({
    label: "",
    value: "",
  });
  const [budgetApprovedByVendor, setBudgetApprovedByVendor] = useState("");
  const [exchangeRates, setExchangeRates] = useState<any>({
    label: "",
    value: "",
  });
  const [estimatedIncomeBudgetCurrency, setEstimatedIncomeBudgetCurrency] =
    useState("");
  const [estimatedCostsBudgetCurrency, setEstimatedCostsBudgetCurrency] =
    useState("");
  const [netProfitTargetBudgetCurrency, setNetProfitTargetBudgetCurrency] =
    useState("");
  const [estimatedIncome, setEstimatedIncome] = useState("");
  const [estimatedCosts, setEstimatedCosts] = useState("");
  const [netProfitTarget, setNetProfitTarget] = useState("");
  const [companiesParticipating, setCompaniesParticipating] = useState<any>([]);
  const [comments, setComments] = useState("");
  const [vendor, setVendor] = useState<any>({});
  const [costBreakdown, setCostBreakdown] = useState<any>([]);

  const [totalcbShare, setTotalcbShare] = useState("0.00");
  const [totalcbContribution, setTotalcbContribution] = useState("0.00");
  const [totalcbCosts, setTotalcbCosts] = useState("0.00");

  const [totalVendorBudgetInLC, setTotalVendorBudgetInLC] = useState(0);
  const [totalVendorBudgetInEUR, setTotalVendorBudgetInEUR] = useState(0);

  const [totalEstimatedCostsLC, setTotalEstimatedCostsLC] = useState("");

  const [injectionReady, setInjectionReady] = useState(false);

  const [render, rerender] = useState(0);

  useEffect(() => {
    if (props.submission) {
      setRequestorsCompanyName({
        label: props.submission.data.requestorsCompanyName ?? "",
        value: {
          name: props.submission.data.requestorsCompanyName ?? "",
          code: props.submission.data.companyCode ?? "",
          country: props.submission.data.requestorsCountry ?? "",
          currency: props.submission.data.localCurrency ?? "",
        },
      });
      setCampaignName(props.submission.data.campaignName ?? "");
      setCampaignDescription(props.submission.data.campaignDescription ?? "");
      setTargetAudience(props.submission.data.targetAudience ?? "");
      setCampaignChannel({
        label: props.submission.data.campaignChannel ?? "",
        value:
          props.submission.data.campaignChannel.length > 0
            ? props.submission.data.campaignChannel.substr(0, 1)
            : "",
      });
      setYear({
        label: props.submission.data.year ?? "",
        value: props.submission.data.year ?? "",
      });
      setOrganizingCompany(props.submission.data.organizingCompany ?? "");
      setProjectStartQuarter({
        label: props.submission.data.projectStartQuarter ?? "",
        value:
          props.submission.data.projectStartQuarter.length > 0
            ? props.submission.data.projectStartQuarter.substr(0, 2)
            : "",
      });
      setProjectNumber(props.submission.data.projectNumber ?? "");
      setRequestorsName(props.submission.data.requestorsName ?? "");
      setFiscalQuarter({
        label: props.submission.data.manufacturersFiscalQuarter ?? "",
        value: props.submission.data.manufacturersFiscalQuarter ?? "",
      });
      setStartDate(new Date(props.submission.data.campaignStartDate) || null);
      setEndDate(new Date(props.submission.data.campaignEndDate) || null);
      setBudgetSource({
        label: props.submission.data.budgetSource ?? "",
        value: props.submission.data.budgetSource ?? "",
      });
      setBudgetApprovedByVendor(
        props.submission.data.budgetApprovedByVendor ?? ""
      );
      setExchangeRates({
        label: props.submission.data.campaignBudgetsCurrency ?? "",
        value: props.submission.data.campaignBudgetsCurrency ?? "",
      });
      setEstimatedIncomeBudgetCurrency(
        (
          props.submission.data.campaignEstimatedIncomeBudgetsCurrency ?? 0
        ).toString()
      );
      setEstimatedIncome(
        props.submission.data.campaignEstimatedIncomeEur.toFixed(2) || "0.00"
      );
      setEstimatedCosts(
        props.submission.data.campaignEstimatedCostsEur.toFixed(2) || "0.00"
      );
      setNetProfitTarget(
        props.submission.data.campaignNetProfitTargetEur.toFixed(2) || "0.00"
      );
      setEstimatedCostsBudgetCurrency(
        (
          props.submission.data.campaignEstimatedCostsBudgetsCurrency ?? 0
        ).toString()
      );
      setNetProfitTargetBudgetCurrency(
        (
          props.submission.data.campaignNetProfitTargetBudgetsCurrency ?? 0
        ).toString()
      );
      setLocalExchangeRate(
        parseFloat(
          (
            ExchangeRates.find(
              (rate) => rate.label === props.submission.data.localCurrency
            ) || "0"
          ).value
        )
      );
      setComments(props.submission.data.comments ?? "");
      setTotalEstimatedCostsLC(
        props.submission.data.totalEstimatedCostsLC.toFixed(2) || "0.00"
      );

      //

      if (props.children && props.children.length > 0) {
        var vs = props.children.find((s) => s.group === "vendor");
        setVendorName({
          label: vs.data.vendorName ?? "",
          value: vs.data.vendorName ?? "",
        });
        setVendor({
          vendor: vs.data.vendorName ?? "",
          projectManager: vs.data.productionProjectManager ?? "",
          creditor: vs.data.creditorNumber ?? "",
          debitor: vs.data.debitorNumber ?? "",
          manufacturer: vs.data.manufacturerNumber ?? "",
          bu: vs.data.businessUnit ?? "",
          ph: {
            label: vs.data.PH1 || "1",
            value: vs.data.PH1 || "1",
          },
          budgetCurrency: {
            label: vs.data.budgetCurrency || "",
            value: vs.data.budgetCurrency || "",
          },
          budgetAmount: "",
          localBudget: "",
          eurBudget: "",
          share: "100",
          estimatedCostsCC: "",
          estimatedIncomeCC: "",
          estimatedCostsLC: "",
          estimatedCostsEUR: "",
          netProfitTargetVC: "",
          netProfitTargetLC: "",
          netProfitTargetEUR: "",
        });
        setCompaniesParticipating(
          props.children
            .filter((s) => s.group === "country")
            .map((s) => {
              return {
                label: s.data.companyName,
                value: {
                  code: s.data.countryCodeEMEA,
                  country: s.data.countriesEMEA,
                },
              };
            })
        );
        var c: any[] = [];
        props.children
          .filter((s) => s.group === "country")
          .forEach((s) => {
            c.push({
              companyName: s.data.companyName,
              companyCode: s.data.countryCodeEMEA,
              country: s.data.countriesEMEA,
              contactEmail: s.data.productionProjectManager,
              projectNumber: s.data.projectNumber,
              share: (s.data.countryShare || 0).toFixed(2),
              contribution: (s.data.countryBudgetContributionCC || 0).toFixed(
                2
              ),
              estimatedCosts: (s.data.countryCostEstimationCC || 0).toFixed(2),
            });
          });
        setCostBreakdown([...c]);
      }

      setTimeout(() => {
        setInjectionReady(true);
      }, 1000);
    }
  }, [props.submission, props.children, ExchangeRates]);

  async function fetchDropdowns() {
    var dropdownsIds: string[] = [
      "619b630a9a5a2bb37a93b23b",
      "619b61419a5a2bb37a93b237",
      "619b63429a5a2bb37a93b23d",
      "619b62d79a5a2bb37a93b239",
      "619b632c9a5a2bb37a93b23c",
      "619b62959a5a2bb37a93b238",
      "619b62f29a5a2bb37a93b23a",
      "619b66defe27d06ad17d75ac",
      "619b6754fe27d06ad17d75ad",
      "619b6799fe27d06ad17d75ae",
      "633e93ed5a7691ac30c977fc",
    ];
    var responses = await Promise.all(
      dropdownsIds.map((di) => {
        return RestAPI.getDropdownValues(di);
      })
    );
    console.log(responses[1].data);
    PH1 = responses[0].data;
    Companies = responses[1].data;
    VendorsNames = responses[2].data;
    CampaignChannel = responses[3].data;
    TargetAudience = responses[4].data;
    Budget = responses[5].data;
    ExchangeRates = responses[6].data;
    FiscalQuarter = responses[7].data;
    Year = responses[8].data;
    ProjectStartQuarter = responses[9].data;
    BUs = responses[10].data;
  }

  useEffect(() => {
    if (props.submission && !injectionReady) {
      return;
    }
    setTotalEstimatedCostsLC(
      (parseFloat(estimatedCosts) * localExchangeRate).toFixed(2)
    );
  }, [estimatedCosts, localExchangeRate]);

  useEffect(() => {
    getAccountInfo().then((response) => {
      if (response) {
        setRequestorsName(response.displayName);
      }
    });
    fetchDropdowns().then(() => forceUpdate());
  }, []);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (props.submission && !injectionReady) {
      return;
    }
    var data: any = [];
    companiesParticipating.forEach((company: any) => {
      data.push({
        companyName: company.label,
        companyCode: company.value.code,
        country: company.value.country,
        contactEmail: "",
        projectNumber:
          projectNumber.length > 0
            ? company.value.code + projectNumber.substring(4)
            : "",
        contribution: "",
        estimatedCosts: "",
        contributionEur: "",
        estimatedCostsEur: "",
        share: "",
      });
    });
    setCostBreakdown(data);
  }, [companiesParticipating, projectNumber]);

  useEffect(() => {
    var totalShare = 0.0;
    var totalContribution = 0.0;
    var totalCosts = 0.0;
    var temp = [...costBreakdown];
    // contributionEur: "",
    // estimatedCostsEur: "",
    temp.forEach((row: any) => {
      if (budgetSource.value === "noBudget") {
        row.contribution = "0.00";
        row.contributionEur = "0.00";
      } else {
        row.contribution = (
          parseFloat(row.share) *
          0.01 *
          parseFloat(estimatedIncomeBudgetCurrency)
        ).toFixed(2);
        row.contributionEur = (
          parseFloat(row.share) *
          0.01 *
          parseFloat(estimatedIncome)
        ).toFixed(2);
        console.log(
          (parseFloat(row.share) * 0.01 * parseFloat(estimatedIncome)).toFixed(
            2
          )
        );
      }

      row.estimatedCosts = (
        parseFloat(row.share) *
        0.01 *
        parseFloat(estimatedCostsBudgetCurrency)
      ).toFixed(2);
      row.estimatedCostsEur = (
        parseFloat(row.share) *
        0.01 *
        parseFloat(estimatedCosts)
      ).toFixed(2);
      totalShare += parseFloat(row.share) || 0;
      totalContribution += parseFloat(row.contribution) || 0;
      totalCosts += parseFloat(row.estimatedCosts) || 0;
    });
    if (!isEqual(costBreakdown, temp)) {
      setCostBreakdown(temp);
    }
    setTotalcbShare(totalShare.toFixed(2));
    setTotalcbContribution(totalContribution.toFixed(2));
    setTotalcbCosts(totalCosts.toFixed(2));
  }, [
    costBreakdown,
    estimatedIncomeBudgetCurrency,
    estimatedCostsBudgetCurrency,
  ]);

  useEffect(() => {
    if (props.submission && !injectionReady) {
      return;
    }
    if (vendorName.value) {
      setVendor({
        vendor: vendorName.label,
        projectManager: vendorName.value.alsoMarketingConsultant,
        creditor: vendorName.value.kreditor,
        debitor: vendorName.value.debitorischer,
        manufacturer: vendorName.value.hersteller,
        bu: vendor.bu,
        ph: { label: "", value: "" },
        budgetCurrency: { label: "", value: "" },
        budgetAmount: "",
        localBudget: "",
        eurBudget: "",
        share: "",
        estimatedCostsCC: "",
        estimatedIncomeCC: "",
        estimatedCostsLC: "",
        estimatedCostsEUR: "",
        netProfitTargetVC: "",
        netProfitTargetLC: "",
        netProfitTargetEUR: "",
      });
    }
  }, [vendorName]);

  useEffect(() => {
    if (props.submission && !injectionReady) {
      return;
    }
    setEstimatedCosts(
      (
        parseFloat(estimatedCostsBudgetCurrency) /
        parseFloat(exchangeRates.value)
      )
        .toFixed(2)
        .toString()
    );
    if (budgetSource.value !== "noBudget") {
      setEstimatedIncome(
        (
          parseFloat(estimatedIncomeBudgetCurrency) /
          parseFloat(exchangeRates.value)
        )
          .toFixed(2)
          .toString()
      );
      setNetProfitTarget(
        (parseFloat(estimatedIncome) - parseFloat(estimatedCosts))
          .toFixed(2)
          .toString()
      );
      setNetProfitTargetBudgetCurrency(
        (
          parseFloat(estimatedIncomeBudgetCurrency) -
          parseFloat(estimatedCostsBudgetCurrency)
        )
          .toFixed(2)
          .toString()
      );
    } else {
      setNetProfitTarget(estimatedCosts);
      setNetProfitTargetBudgetCurrency(estimatedCostsBudgetCurrency);
    }
  }, [
    budgetSource,
    estimatedIncome,
    estimatedCosts,
    exchangeRates,
    estimatedIncomeBudgetCurrency,
    estimatedCostsBudgetCurrency,
  ]);

  useEffect(() => {
    if (props.submission && !injectionReady) {
      return;
    }

    setProjectNumber(
      (requestorsCompanyName.value.code === ""
        ? "????"
        : requestorsCompanyName.value.code) +
        (organizingCompany === "" ? "??" : organizingCompany) +
        (year.value === "" ? "??" : year.value) +
        (campaignChannel.value === "" ? "?" : campaignChannel.value) +
        (projectStartQuarter.value === ""
          ? "?"
          : projectStartQuarter.value.slice(1)) +
        "01"
    );
  }, [
    year,
    organizingCompany,
    campaignChannel,
    projectStartQuarter,
    requestorsCompanyName,
  ]);

  return (
    <Box>
      <VStack spacing="20px" mb={"40px"} align="start">
        <Text as="b">Requestor`s Details</Text>
        <Box w="100%">
          <Text mb="8px">Requestor`s Company Name</Text>
          <Select
            menuPortalTarget={document.body}
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 1000000,
              }),
              singleValue: (provided) => ({
                ...provided,
                color: "#718196",
              }),
              control: (base, state) => ({
                ...base,
                minHeight: 40,
                border: "1px solid #E2E8F0",
                transition: "0.3s",
                "&:hover": {
                  border: "1px solid #CBD5E0",
                },
              }),
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 6,
              colors: {
                ...theme.colors,
                primary: "#3082CE",
              },
            })}
            value={{
              label: requestorsCompanyName.label,
              value: requestorsCompanyName.value,
            }}
            onChange={(value: any) => {
              var ler = 0.0;
              ExchangeRates.forEach((rate) => {
                if (rate.label === value.value.currency) {
                  ler = parseFloat(rate.value);
                }
              });
              setLocalExchangeRate(ler);
              setRequestorsCompanyName(value);
            }}
            classNamePrefix="select"
            isClearable={false}
            name="requestorsCompanyName"
            options={Companies}
          />
        </Box>
        <HStack w="100%">
          <Box w="100%">
            <Text mb="8px">Requestor`s Company Code</Text>
            <Input
              defaultValue={requestorsCompanyName.value.code}
              disabled
              bg={useColorModeValue("white", "#2C313C")}
              color={useColorModeValue("gray.800", "#ABB2BF")}
            />
          </Box>
          <Box w="100%">
            <Text mb="8px">Requestor`s Country</Text>
            <Input
              defaultValue={requestorsCompanyName.value.country}
              disabled
              bg={useColorModeValue("white", "#2C313C")}
              color={useColorModeValue("gray.800", "#ABB2BF")}
            />
          </Box>
        </HStack>
        <Alert
          status="error"
          display={
            requestorsCompanyName.value.code !== "6110" &&
            requestorsCompanyName.value.code !== ""
              ? "flex"
              : "none"
          }
        >
          <AlertIcon />
          <AlertTitle>Attention!</AlertTitle>
          <AlertDescription>
            Please note no actual project for 1550 will be created in the tool
            just yet, this still needs to be done via the usual process. But a
            project for Switzerland will be created if they are part of the
            campaign, as they are using the tool. Other countries and 1550 will
            follow.
          </AlertDescription>
        </Alert>
        <Box w="100%">
          <Text mb="8px">Organizing Company</Text>
          <Select
            menuPortalTarget={document.body}
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 1000000,
              }),
              singleValue: (provided) => ({
                ...provided,
                color: "#718196",
              }),
              control: (base, state) => ({
                ...base,
                minHeight: 40,
                border: "1px solid #E2E8F0",
                transition: "0.3s",
                "&:hover": {
                  border: "1px solid #CBD5E0",
                },
              }),
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 6,
              colors: {
                ...theme.colors,
                primary: "#3082CE",
              },
            })}
            value={{
              label: organizingCompany,
              value: organizingCompany,
            }}
            onChange={(selected: any) => {
              setOrganizingCompany(selected.value);
            }}
            classNamePrefix="select"
            isClearable={false}
            name="organizingCompany"
            options={Companies.map((company) => {
              return {
                label: company.value.country,
                value: company.value.country,
              };
            })}
          />
        </Box>
        <Text as="b">Campaign`s Details</Text>

        <Box w="100%">
          <Text mb="8px">
            Campaign Name (40 characters limit. Naming Convention: 'Vendor Name
            1' 'Vendor Name 2'... 'Campaign Name')
          </Text>
          <Input
            maxLength={40}
            value={campaignName}
            onChange={(event) => {
              setCampaignName(event.target.value);
            }}
            bg={useColorModeValue("white", "#2C313C")}
            color={useColorModeValue("gray.800", "#ABB2BF")}
          />
        </Box>

        <Box w="100%">
          <Text mb="8px">Campaign Description</Text>
          <Textarea
            value={campaignDescription}
            onChange={(event) => {
              setCampaignDescription(event.target.value);
            }}
            bg={useColorModeValue("white", "#2C313C")}
            color={useColorModeValue("gray.800", "#ABB2BF")}
            size="md"
            resize={"vertical"}
            rows={5}
          />
        </Box>
        <Box w="100%">
          <Text mb="8px">Campaign Channel</Text>
          <Select
            menuPortalTarget={document.body}
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 1000000,
              }),
              singleValue: (provided) => ({
                ...provided,
                color: "#718196",
              }),
              control: (base, state) => ({
                ...base,
                minHeight: 40,
                border: "1px solid #E2E8F0",
                transition: "0.3s",
                "&:hover": {
                  border: "1px solid #CBD5E0",
                },
              }),
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 6,
              colors: {
                ...theme.colors,
                primary: "#3082CE",
              },
            })}
            value={campaignChannel}
            placeholder=""
            onChange={(value: any) => {
              setCampaignChannel(value);
            }}
            classNamePrefix="select"
            isClearable={false}
            name="campaignChannel"
            options={CampaignChannel}
          />
        </Box>

        <Box w="100%">
          <Text mb="8px">Year</Text>
          <Select
            menuPortalTarget={document.body}
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 1000000,
              }),
              singleValue: (provided) => ({
                ...provided,
                color: "#718196",
              }),
              control: (base, state) => ({
                ...base,
                minHeight: 40,
                border: "1px solid #E2E8F0",
                transition: "0.3s",
                "&:hover": {
                  border: "1px solid #CBD5E0",
                },
              }),
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 6,
              colors: {
                ...theme.colors,
                primary: "#3082CE",
              },
            })}
            value={{ label: year.label, value: year.value }}
            placeholder=""
            onChange={(value: any) => {
              setYear(value);
            }}
            classNamePrefix="select"
            isClearable={false}
            name="year"
            options={Year}
          />
        </Box>
        <Box w="100%">
          <Text mb="8px">Campaign/Project Start Quarter (ALSO Quarter)</Text>
          <Select
            menuPortalTarget={document.body}
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 1000000,
              }),
              singleValue: (provided) => ({
                ...provided,
                color: "#718196",
              }),
              control: (base, state) => ({
                ...base,
                minHeight: 40,
                border: "1px solid #E2E8F0",
                transition: "0.3s",
                "&:hover": {
                  border: "1px solid #CBD5E0",
                },
              }),
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 6,
              colors: {
                ...theme.colors,
                primary: "#3082CE",
              },
            })}
            value={{
              label: projectStartQuarter.label,
              value: projectStartQuarter.value,
            }}
            placeholder=""
            onChange={(value: any) => {
              setProjectStartQuarter(value);
            }}
            classNamePrefix="select"
            isClearable={false}
            name="projectStartQuarter"
            options={ProjectStartQuarter}
          />
        </Box>
        <Box w="100%">
          <Text mb="8px">Project Number</Text>
          <Input
            placeholder="____________"
            value={projectNumber}
            onChange={(event) => {
              if (event.target.value.length < 13) {
                setProjectNumber(event.target.value);
              }
            }}
            // disabled
            bg={useColorModeValue("white", "#2C313C")}
            color={useColorModeValue("gray.800", "#ABB2BF")}
          />
        </Box>
        <Box w="100%">
          <Text mb="8px">Requestor`s Name</Text>
          <Input
            value={requestorsName}
            onChange={(event) => setRequestorsName(event.target.value)}
            // disabled
            bg={useColorModeValue("white", "#2C313C")}
            color={useColorModeValue("gray.800", "#ABB2BF")}
          />
        </Box>
        <HStack w="100%">
          <Box w="100%">
            <Text mb="8px">Campaign Start Date</Text>
            <DatePicker
              customInput={
                <Input
                  bg={useColorModeValue("white", "#2C313C")}
                  color={useColorModeValue("gray.800", "#ABB2BF")}
                />
              }
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
              }}
              dateFormat="dd.MM.yyyy"
            />
          </Box>
          <Box w="100%">
            <Text mb="8px">Campaign End Date</Text>
            <DatePicker
              customInput={
                <Input
                  bg={useColorModeValue("white", "#2C313C")}
                  color={useColorModeValue("gray.800", "#ABB2BF")}
                />
              }
              selected={endDate}
              onChange={(date) => {
                setEndDate(date);
              }}
              dateFormat="dd.MM.yyyy"
            />
          </Box>
        </HStack>
        <Text as="b">Financial details</Text>
        <Box w="100%">
          <Text mb="8px">Budget Source</Text>
          <Select
            menuPortalTarget={document.body}
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 1000000,
              }),
              singleValue: (provided) => ({
                ...provided,
                color: "#718196",
              }),
              control: (base, state) => ({
                ...base,
                minHeight: 40,
                border: "1px solid #E2E8F0",
                transition: "0.3s",
                "&:hover": {
                  border: "1px solid #CBD5E0",
                },
              }),
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 6,
              colors: {
                ...theme.colors,
                primary: "#3082CE",
              },
            })}
            value={budgetSource}
            onChange={(value) => {
              setBudgetSource(value);
            }}
            placeholder=""
            classNamePrefix="select"
            isClearable={false}
            name="fiscalQuarter"
            options={Budget}
          />
        </Box>
        <Box w="100%">
          <Text mb="8px">Local Currency</Text>
          <Input
            defaultValue={requestorsCompanyName.value.currency}
            disabled
            bg={useColorModeValue("white", "#2C313C")}
            color={useColorModeValue("gray.800", "#ABB2BF")}
          />
        </Box>
        <Box w="100%">
          <Text mb="8px">Campaign Currency</Text>
          <Select
            menuPortalTarget={document.body}
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 1000000,
              }),
              singleValue: (provided) => ({
                ...provided,
                color: "#718196",
              }),
              control: (base, state) => ({
                ...base,
                minHeight: 40,
                border: "1px solid #E2E8F0",
                transition: "0.3s",
                "&:hover": {
                  border: "1px solid #CBD5E0",
                },
              }),
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 6,
              colors: {
                ...theme.colors,
                primary: "#3082CE",
              },
            })}
            value={exchangeRates}
            onChange={(value) => {
              setExchangeRates(value);
            }}
            placeholder=""
            classNamePrefix="select"
            isClearable={false}
            name="campaignCurrency"
            options={ExchangeRates}
          />
        </Box>
        <Box w="100%">
          <Text mb="8px">Campaign Estimated Income in Campaign Currency</Text>
          <Input
            disabled={budgetSource.value === "noBudget"}
            value={estimatedIncomeBudgetCurrency}
            onChange={(event) => {
              setEstimatedIncomeBudgetCurrency(event.target.value);
            }}
            bg={useColorModeValue("white", "#2C313C")}
            color={useColorModeValue("gray.800", "#ABB2BF")}
          />
        </Box>
        <Box w="100%">
          <Text mb="8px">Campaign Estimated Costs in Campaign Currency</Text>
          <Input
            value={estimatedCostsBudgetCurrency}
            onChange={(event) => {
              setEstimatedCostsBudgetCurrency(event.target.value);
            }}
            bg={useColorModeValue("white", "#2C313C")}
            color={useColorModeValue("gray.800", "#ABB2BF")}
          />
        </Box>
        <Box w="100%">
          <Text mb="8px">
            {budgetSource.value === "noBudget"
              ? "Campaign Loss in Campaign currency"
              : "Campaign Net Profit Target in Campaign Currency"}
          </Text>
          <Input
            value={netProfitTargetBudgetCurrency}
            onChange={(event) => {
              setNetProfitTargetBudgetCurrency(event.target.value);
            }}
            bg={useColorModeValue("white", "#2C313C")}
            color={useColorModeValue("gray.800", "#ABB2BF")}
          />
        </Box>
        <Box w="100%">
          <Text mb="8px">Campaign Estimated Income in EUR</Text>
          <Input
            disabled={budgetSource.value === "noBudget"}
            value={estimatedIncome}
            onChange={(event) => {
              setEstimatedIncome(event.target.value);
            }}
            bg={useColorModeValue("white", "#2C313C")}
            color={useColorModeValue("gray.800", "#ABB2BF")}
          />
        </Box>
        <Box w="100%">
          <Text mb="8px">Campaign Estimated Costs in EUR</Text>
          <Input
            value={estimatedCosts}
            onChange={(event) => {
              setEstimatedCosts(event.target.value);
            }}
            bg={useColorModeValue("white", "#2C313C")}
            color={useColorModeValue("gray.800", "#ABB2BF")}
          />
        </Box>
        <Box w="100%">
          <Text mb="8px">
            {budgetSource.value === "noBudget"
              ? "Campaign Loss in EUR"
              : "Campaign Net Profit Target in EUR"}
          </Text>
          <Input
            // value={netProfitTarget}
            value={netProfitTarget}
            onChange={(event) => {
              setNetProfitTarget(event.target.value);
            }}
            bg={useColorModeValue("white", "#2C313C")}
            color={useColorModeValue("gray.800", "#ABB2BF")}
          />
        </Box>
        <Box w="100%">
          <Text mb="8px">Total Estimated Costs in Local Currency</Text>
          <Input
            value={totalEstimatedCostsLC}
            onChange={(event) => {
              setTotalEstimatedCostsLC(event.target.value);
            }}
            bg={useColorModeValue("white", "#2C313C")}
            color={useColorModeValue("gray.800", "#ABB2BF")}
          />
        </Box>

        <Box w="100%">
          <Text mb="8px">Vendor Name</Text>
          <Select
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 1000000,
              }),
              singleValue: (provided) => ({
                ...provided,
                color: "#718196",
              }),
              control: (base, state) => ({
                ...base,
                minHeight: 40,
                border: "1px solid #E2E8F0",
                transition: "0.3s",
                "&:hover": {
                  border: "1px solid #CBD5E0",
                },
              }),
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 6,
              colors: {
                ...theme.colors,
                primary: "#3082CE",
              },
            })}
            value={vendorName}
            placeholder=""
            onChange={(value: any) => {
              setVendorName(value);
            }}
            classNamePrefix="select"
            isClearable={false}
            name="vendorsName"
            options={VendorsNames}
          />
        </Box>
        <Box w="100%">
          <Text mb="8px">VOD</Text>
          <Input
            bgColor={"white"}
            value={vendor.debitor}
            onChange={(event) => {
              var temp = { ...vendor };
              temp.debitor = event.target.value;
              setVendor(temp);
            }}
          />
        </Box>
        <Box w="100%">
          <Text mb="8px">Creditor</Text>
          <Input
            bgColor={"white"}
            value={vendor.creditor}
            onChange={(event) => {
              var temp = { ...vendor };
              temp.creditor = event.target.value;
              setVendor(temp);
            }}
          />
        </Box>
        <Box w="100%">
          <Text mb="8px">Manufacturer</Text>
          <Input
            bgColor={"white"}
            value={vendor.manufacturer}
            onChange={(event) => {
              var temp = { ...vendor };
              temp.manufacturer = event.target.value;
              setVendor(temp);
            }}
          />
        </Box>
        <Box w="100%">
          <Text mb="8px">Business Unit</Text>
          <Select
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 1000000,
              }),
              singleValue: (provided) => ({
                ...provided,
                color: "#718196",
              }),
              control: (base, state) => ({
                ...base,
                minHeight: 40,
                border: "1px solid #E2E8F0",
                transition: "0.3s",
                "&:hover": {
                  border: "1px solid #CBD5E0",
                },
              }),
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 6,
              colors: {
                ...theme.colors,
                primary: "#3082CE",
              },
            })}
            value={{
              label: vendor.bu,
              value:
                typeof vendor.bu === "string" ? vendor.bu.substr(0, 3) : "",
            }}
            placeholder=""
            onChange={(value: any) => {
              console.log(value);
              var temp = { ...vendor };
              temp.bu = value.label;
              setVendor(temp);
            }}
            classNamePrefix="select"
            isClearable={false}
            name="BUs"
            options={BUs}
          />
        </Box>
        <Box w="100%">
          <Text mb="8px">PH1</Text>
          <Select
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 1000000000,
              }),
              menuPortal: (base) => ({ ...base, zIndex: 10000000 }),
              singleValue: (provided) => ({
                ...provided,
                color: "#718196",
              }),
              control: (base, state) => ({
                ...base,
                minHeight: 40,
                border: "1px solid #E2E8F0",
                transition: "0.3s",
                "&:hover": {
                  border: "1px solid #CBD5E0",
                },
              }),
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 6,
              colors: {
                ...theme.colors,
                primary: "#3082CE",
              },
            })}
            menuPortalTarget={document.body}
            value={vendor.ph}
            onChange={(value) => {
              var temp = { ...vendor };
              temp.ph = value;
              setVendor(temp);
            }}
            placeholder=""
            classNamePrefix="select"
            isClearable={false}
            name="PH1"
            options={PH1}
          />
        </Box>

        <Box w="100%">
          <Text mb="8px">Companies Participating</Text>
          <Select
            menuPortalTarget={document.body}
            isMulti
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 1000000,
              }),
              menuPortal: (base) => ({ ...base, zIndex: 10000000 }),
              singleValue: (provided) => ({
                ...provided,
                color: "#718196",
              }),
              control: (base, state) => ({
                ...base,
                minHeight: 40,
                border: "1px solid #E2E8F0",
                transition: "0.3s",
                "&:hover": {
                  border: "1px solid #CBD5E0",
                },
              }),
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 6,
              colors: {
                ...theme.colors,
                primary: "#3082CE",
              },
            })}
            value={companiesParticipating}
            placeholder=""
            onChange={(value: any) => {
              setCompaniesParticipating(value);
            }}
            classNamePrefix="select"
            isClearable={false}
            name="companiesParticipating"
            options={Companies}
          />
        </Box>

        <Box w="100%">
          <Text mb="8px">Country Breakdown</Text>
          <Table
            shouldUpdateScroll={false}
            hover={false}
            autoHeight
            rowHeight={65}
            data={[
              ...costBreakdown,
              {
                companyName: "TOTAL",
                share: totalcbShare + "%",
                contribution: totalcbContribution + " " + exchangeRates.label,
                estimatedCosts: totalcbCosts + " " + exchangeRates.label,
                contributionEur: estimatedIncome + " EUR",
                estimatedCostsEur: estimatedCosts + " EUR",
              },
            ]}
          >
            <Column width={200} resizable>
              <HeaderCell>Company Name</HeaderCell>
              <Cell dataKey="companyName">
                {(rowData, index) => (
                  <Input
                    value={rowData.companyName}
                    onChange={(event) => {
                      var temp = [...costBreakdown];
                      temp[index!].companyName = event.target.value;
                      setCostBreakdown(temp);
                    }}
                  />
                )}
              </Cell>
            </Column>

            <Column width={200} resizable>
              <HeaderCell>Company Code</HeaderCell>
              <Cell dataKey="companyCode">
                {(rowData, index) => (
                  <Input
                    value={rowData.companyCode}
                    onChange={(event) => {
                      var temp = [...costBreakdown];
                      temp[index!].companyCode = event.target.value;
                      setCostBreakdown(temp);
                    }}
                  />
                )}
              </Cell>
            </Column>

            <Column width={100} resizable>
              <HeaderCell>Country</HeaderCell>
              <Cell dataKey="country">
                {(rowData, index) => (
                  <Input
                    value={rowData.country}
                    onChange={(event) => {
                      var temp = [...costBreakdown];
                      temp[index!].country = event.target.value;
                      setCostBreakdown(temp);
                    }}
                  />
                )}
              </Cell>
            </Column>

            <Column width={200} resizable>
              <HeaderCell>Contact Person's Email</HeaderCell>
              <Cell dataKey="contactEmail">
                {(rowData, index) => (
                  <Input
                    value={rowData.contactEmail}
                    onChange={(event) => {
                      var temp = [...costBreakdown];
                      temp[index!].contactEmail = event.target.value;
                      setCostBreakdown(temp);
                    }}
                  />
                )}
              </Cell>
            </Column>

            <Column width={200} resizable>
              <HeaderCell>Local Project Number</HeaderCell>
              <Cell dataKey="projectNumber">
                {(rowData, index) => (
                  <Input
                    value={rowData.projectNumber}
                    onChange={(event) => {
                      var temp = [...costBreakdown];
                      temp[index!].projectNumber = event.target.value;
                      setCostBreakdown(temp);
                    }}
                  />
                )}
              </Cell>
            </Column>
            <Column width={100} resizable>
              <HeaderCell>Share %</HeaderCell>
              <Cell dataKey="share">
                {(rowData, index) => (
                  <Input
                    value={rowData.share}
                    onChange={(event) => {
                      var temp = [...costBreakdown];
                      temp[index!].share = event.target.value;
                      setCostBreakdown(temp);
                    }}
                  />
                )}
              </Cell>
            </Column>
            <Column width={400} resizable>
              <HeaderCell>Budget Contribution in Campaign Currency</HeaderCell>
              <Cell dataKey="contribution">
                {(rowData, index) => (
                  <Input
                    disabled={budgetSource.value === "noBudget"}
                    value={rowData.contribution}
                    onChange={(event) => {
                      var temp = [...costBreakdown];
                      temp[index!].contribution = event.target.value;
                      setCostBreakdown(temp);
                    }}
                  />
                )}
              </Cell>
            </Column>
            <Column width={400} resizable>
              <HeaderCell>
                Total Estimated Costs in Campaign Currency
              </HeaderCell>
              <Cell dataKey="estimatedCosts">
                {(rowData, index) => (
                  <Input
                    value={rowData.estimatedCosts}
                    onChange={(event) => {
                      var temp = [...costBreakdown];
                      temp[index!].estimatedCosts = event.target.value;
                      setCostBreakdown(temp);
                    }}
                  />
                )}
              </Cell>
            </Column>
            <Column width={400} resizable>
              <HeaderCell>Budget contribution in Euro</HeaderCell>
              <Cell dataKey="budgetContributionEur">
                {(rowData, index) => (
                  <Input
                    value={rowData.contributionEur}
                    onChange={(event) => {}}
                  />
                )}
              </Cell>
            </Column>
            <Column width={400} resizable>
              <HeaderCell>Total estimated costs in Euro</HeaderCell>
              <Cell dataKey="estimatedCostsEur">
                {(rowData, index) => (
                  <Input
                    value={rowData.estimatedCostsEur}
                    onChange={(event) => {}}
                  />
                )}
              </Cell>
            </Column>
          </Table>
        </Box>
        <Box w="100%">
          <Text mb="8px">Comments</Text>
          <Textarea
            value={comments}
            onChange={(event) => {
              setComments(event.target.value);
            }}
            bg={useColorModeValue("white", "#2C313C")}
            color={useColorModeValue("gray.800", "#ABB2BF")}
            size="md"
            resize={"vertical"}
            rows={5}
          />
        </Box>
      </VStack>
      <Button
        float="right"
        mb={"80px"}
        color={"white"}
        bg={useColorModeValue("green.400", "#4D97E2")}
        _hover={{
          bg: useColorModeValue("green.300", "#377bbf"),
        }}
        onClick={() => {
          interface FD {
            [key: string]: any;
          }

          var formattedData = [];
          formattedData.push(["Request", "European One Vendor"]);
          formattedData.push([
            "Requestor`s Company Name",
            requestorsCompanyName.label,
          ]);
          formattedData.push([
            "Requestor`s Company Code",
            requestorsCompanyName.value.code,
          ]);
          formattedData.push([
            "Requestor`s Country",
            requestorsCompanyName.value.country,
          ]);
          formattedData.push(["Organizing Company", organizingCompany]);
          formattedData.push(["Campaign Name", campaignName]);
          formattedData.push(["Campaign Description", campaignDescription]);
          formattedData.push(["Campaign Channel", campaignChannel.label]);
          formattedData.push(["Year", year.label]);
          formattedData.push([
            "Campaign/Project Start Quarter (ALSO Quarter)",
            projectStartQuarter.label,
          ]);
          formattedData.push(["Project Number", projectNumber]);
          formattedData.push(["Requestor`s Name", requestorsName]);
          formattedData.push([
            "Campaign Start Date",
            moment(startDate).format("DD.MM.yyyy"),
          ]);
          formattedData.push([
            "Campaign End Date",
            moment(endDate).format("DD.MM.yyyy"),
          ]);
          formattedData.push(["Budget Source", budgetSource.label]);
          formattedData.push([
            "Local Currency",
            requestorsCompanyName.value.currency,
          ]);
          formattedData.push(["Campaign Currency", exchangeRates.label]);
          formattedData.push([
            "Campaign Estimated Income in Campaign Currency",
            estimatedIncomeBudgetCurrency,
          ]);
          formattedData.push([
            "Campaign Estimated Costs in Campaign Currency",
            estimatedCostsBudgetCurrency,
          ]);
          formattedData.push([
            budgetSource.value === "noBudget"
              ? "Campaign Loss in Campaign currency"
              : "Campaign Net Profit Target in Campaign Currency",
            netProfitTargetBudgetCurrency,
          ]);
          formattedData.push([
            "Campaign Estimated Income in EUR",
            estimatedIncome,
          ]);
          formattedData.push([
            "Campaign Estimated Costs in EUR",
            estimatedCosts,
          ]);
          formattedData.push([
            budgetSource.value === "noBudget"
              ? "Campaign Loss in EUR"
              : "Campaign Net Profit Target in EUR",
            netProfitTarget,
          ]);
          formattedData.push([
            "Total Estimated Costs in Local Currency",
            totalEstimatedCostsLC,
          ]);
          formattedData.push(["Vendor Name", vendorName.label]);
          formattedData.push(["VOD", vendor.debitor]);
          formattedData.push(["Creditor", vendor.creditor]);
          formattedData.push(["Manufacturer", vendor.manufacturer]);
          formattedData.push(["Business Unit", vendor.bu]);
          formattedData.push(["PH1", vendor.ph.label]);
          formattedData.push(["Comments", comments]);
          formattedData.push([
            "Companies Participating",
            companiesParticipating.map((v: any) => v.label).join(", "),
          ]);
          formattedData.push([]);
          formattedData.push([
            "Company Name",
            "Company Code",
            "Country",
            "Contact Person's Email",
            "Local Project Number",
            "Share %",
            "Budget Contribution in Campaign Currency",
            "Total Estimated Costs in Campaign Currency",
            "Budget Contribution in EUR",
            "Total Estimated Costs in EUR",
          ]);
          costBreakdown.forEach((company: any) => {
            formattedData.push([
              company.companyName,
              company.companyCode,
              company.country,
              company.contactEmail,
              company.projectNumber,
              company.share,
              company.contribution,
              company.estimatedCosts,
              company.contributionEur,
              company.estimatedCostsEur,
            ]);
          });
          formattedData.push([
            "TOTAL",
            "",
            "",
            "",
            "",
            totalcbShare + "%",
            totalcbContribution + " " + exchangeRates.label,
            totalcbCosts + " " + exchangeRates.label,
            estimatedIncome + " EUR",
            estimatedCosts + " EUR",
          ]);
          var ws = XLSX.utils.aoa_to_sheet(formattedData);
          const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
          const excelBuffer = XLSX.write(wb, {
            bookType: "xlsx",
            type: "array",
          });
          const data = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
          });
          FileSaver.saveAs(data, "test" + ".xlsx");
        }}
      >
        Export
      </Button>
      <Button
        float="right"
        mb={"80px"}
        mr="15px"
        color={"white"}
        bg={useColorModeValue("blue.400", "#4D97E2")}
        _hover={{
          bg: useColorModeValue("blue.300", "#377bbf"),
        }}
        onClick={() => {
          RestAPI.getSubmissions().then((response) => {
            var parentSubmissions = response.data.filter(
              (s) => s.parentId === null
            );
            let isUnique = false;
            let pn = projectNumber;
            while (!isUnique) {
              let found = false;
              for (let s of parentSubmissions) {
                if (s.data.projectNumber === pn) {
                  found = true;
                  break;
                }
              }
              if (!found) {
                isUnique = true;
              } else {
                var newSuffix: any = parseInt(pn.slice(-2)) + 1;
                newSuffix = (newSuffix > 9 ? "" : "0") + newSuffix.toString();
                pn = pn.slice(0, -2) + newSuffix;
              }
            }
            if (pn !== projectNumber) {
              // we changed project number. Notify user
              setProjectNumber(pn);
              toast(
                <Toast
                  title={"SAP Response"}
                  message={`Project Number already exists. Changed to: ${pn}. Press submit again.`}
                  type={"info"}
                />
              );
              return;
            } else {
              var projectId = "6246bc93fa2a446faadb8d9a";

              var parent: Submission = {
                project: projectId,
                title: campaignName,
                parentId: null,
                group: null,
                created: new Date(),
                updated: new Date(),
                status: "New",
                author: requestorsName,
                data: {
                  requestorsCompanyName: requestorsCompanyName.label,
                  companyCode: requestorsCompanyName.value.code,
                  requestorsCountry: requestorsCompanyName.value.country,
                  campaignName: campaignName,
                  projectName: campaignName,
                  campaignDescription: campaignDescription,
                  targetAudience: targetAudience,
                  campaignChannel: campaignChannel.label,
                  year: year.label,
                  projectStartQuarter: projectStartQuarter.label,
                  projectNumber: projectNumber,
                  requestorsName: requestorsName,
                  projectApprover: projectApproval,
                  projectApproval: projectApproval,
                  manufacturersFiscalQuarter: fiscalQuarter.label,
                  campaignStartDate:
                    startDate === null ? null : startDate.toString(),
                  campaignEndDate: endDate === null ? null : endDate.toString(),
                  budgetSource: budgetSource.label,
                  budgetApprovedByVendor: budgetApprovedByVendor,
                  campaignBudgetsCurrency: exchangeRates.label,
                  campaignCurrency: exchangeRates.label,
                  campaignEstimatedIncomeBudgetsCurrency:
                    parseFloat(estimatedIncomeBudgetCurrency) === null
                      ? 0.0
                      : parseFloat(estimatedIncomeBudgetCurrency),
                  campaignEstimatedCostsBudgetsCurrency: parseFloat(
                    estimatedCostsBudgetCurrency
                  ),
                  campaignNetProfitTargetBudgetsCurrency: parseFloat(
                    netProfitTargetBudgetCurrency
                  ),
                  campaignEstimatedIncomeEur:
                    parseFloat(estimatedIncome) === null
                      ? 0.0
                      : parseFloat(estimatedIncome),
                  campaignEstimatedCostsEur: parseFloat(estimatedCosts),
                  campaignNetProfitTargetEur: parseFloat(netProfitTarget),
                  totalEstimatedCostsLC: parseFloat(totalEstimatedCostsLC),
                  comments: comments,
                  additionalInformation: comments,
                  localCurrency: requestorsCompanyName.value.currency,

                  projectType: "European One Vendor",
                },
              };
              var children: Submission[] = [];
              children.push({
                project: projectId,
                title: "",
                parentId: "",
                group: "vendor",
                created: new Date(),
                updated: new Date(),
                status: "New",
                author: requestorsName,
                data: {
                  vendorName: vendorName.label,
                  productionProjectManager: vendor.projectManager,
                  creditorNumber: vendor.creditor,
                  debitorNumber: vendor.debitor,
                  manufacturerNumber: vendor.manufacturer,
                  businessUnit: vendor.bu,
                  PH1: vendor.ph.label,
                  vendorBudgetCurrency:
                    budgetSource.value === "noBudget"
                      ? "N/A"
                      : vendor.budgetCurrency.label,
                  vendorAmount:
                    isNaN(parseFloat(vendor.localBudget)) ||
                    budgetSource.value === "noBudget"
                      ? 0.0
                      : parseFloat(vendor.localBudget),
                  // cbbudgetEur: parseFloat(vendor.eurBudget),
                  vendorShare: 100,
                  estimatedCostsCC: parseFloat(estimatedCostsBudgetCurrency),
                  estimatedIncomeCC:
                    budgetSource.value === "noBudget"
                      ? 0.0
                      : parseFloat(estimatedIncomeBudgetCurrency),
                  estimatedResultCC:
                    parseFloat(netProfitTargetBudgetCurrency) *
                    (budgetSource.value === "noBudget" ? -1 : 1),
                  // cbestimatedCostsLC: parseFloat(vendor.estimatedCostsLC),
                  estimatedIncomeEUR:
                    budgetSource.value === "noBudget"
                      ? 0.0
                      : parseFloat(estimatedIncome),
                  estimatedCostsEUR: parseFloat(estimatedCosts),
                  estimatedResultEUR:
                    parseFloat(netProfitTarget) *
                    (budgetSource.value === "noBudget" ? -1 : 1),
                  estimatedResultBC:
                    parseFloat(netProfitTargetBudgetCurrency) *
                    (budgetSource.value === "noBudget" ? -1 : 1),
                  projectType: "European One Vendor",
                  // cbnetProfitTargetLC: parseFloat(vendor.netProfitTargetLC),
                },
              });

              costBreakdown.forEach((company: any) => {
                children.push({
                  project: projectId,
                  title: "",
                  parentId: "",
                  group: "country",
                  created: new Date(),
                  updated: new Date(),
                  status: "New",
                  author: requestorsName,
                  data: {
                    projectName: campaignName,
                    additionalInformation: comments,
                    campaignChannel: campaignChannel.label,
                    mirrorProjectNumber: projectNumber,
                    projectNumber: company.projectNumber,
                    campaignStartDate:
                      startDate === null ? null : startDate.toString(),
                    campaignEndDate:
                      endDate === null ? null : endDate.toString(),
                    budgetSource: budgetSource.label,
                    campaignCurrency: exchangeRates.label,
                    vendorName: vendorName.label,
                    businessUnit: vendor.bu,
                    PH1: vendor.ph.label,
                    vendorShare: 100,
                    estimatedIncomeEUR:
                      budgetSource.value === "noBudget"
                        ? 0.0
                        : parseFloat(estimatedIncome),
                    estimatedCostsEUR: parseFloat(estimatedCosts),
                    estimatedResultEUR:
                      parseFloat(netProfitTarget) *
                      (budgetSource.value === "noBudget" ? -1 : 1),
                    estimatedResultBC:
                      parseFloat(netProfitTargetBudgetCurrency) *
                      (budgetSource.value === "noBudget" ? -1 : 1),
                    projectType: "European One Vendor",
                    companyName: company.companyName,
                    countryCodeEMEA: company.companyCode,
                    country: company.country,
                    countriesEMEA: company.country,
                    productionProjectManager: company.contactEmail,
                    countryShare: parseFloat(company.share),
                    countryBudgetContributionEur: company.contribution,
                    countryCostEstimationEur: company.estimatedCosts,
                    countryBudgetContributionCC: isNaN(
                      parseFloat(company.contribution)
                    )
                      ? 0.0
                      : parseFloat(company.contribution),
                    countryCostEstimationCC: parseFloat(company.estimatedCosts),
                  },
                });
              });
              var submission: SubmissionWithChildren = {
                submission: parent,
                children,
              };
              RestAPI.createSubmissionWithChildren(submission).then(
                (response) => {
                  props.history.push("/vendors");
                }
              );
            }
          });
        }}
        isDisabled={
          requestorsCompanyName.value.code !== "6110" ||
          (props.submission && !props.isDraft)
        }
      >
        Submit
      </Button>
      <Button
        float="right"
        mb={"80px"}
        mr="15px"
        color={"white"}
        bg={useColorModeValue("blue.400", "#4D97E2")}
        _hover={{
          bg: useColorModeValue("blue.300", "#377bbf"),
        }}
        onClick={() => {
          var projectId = "629dfb3f55d209262194a3e6";

          var parent: Submission = {
            project: projectId,
            title: campaignName,
            parentId: null,
            group: null,
            created: new Date(),
            updated: new Date(),
            status: "New",
            author: requestorsName,
            data: {
              requestorsCompanyName: requestorsCompanyName.label,
              companyCode: requestorsCompanyName.value.code,
              requestorsCountry: requestorsCompanyName.value.country,
              campaignName: campaignName,
              projectName: campaignName,
              campaignDescription: campaignDescription,
              targetAudience: targetAudience,
              campaignChannel: campaignChannel.label,
              year: year.label,
              organizingCompany: organizingCompany,
              projectStartQuarter: projectStartQuarter.label,
              projectNumber: projectNumber,
              requestorsName: requestorsName,
              projectApprover: projectApproval,
              projectApproval: projectApproval,
              manufacturersFiscalQuarter: fiscalQuarter.label,
              campaignStartDate:
                startDate === null ? null : startDate.toString(),
              campaignEndDate: endDate === null ? null : endDate.toString(),
              budgetSource: budgetSource.label,
              budgetApprovedByVendor: budgetApprovedByVendor,
              campaignBudgetsCurrency: exchangeRates.label,
              campaignCurrency: exchangeRates.label,
              campaignEstimatedIncomeBudgetsCurrency:
                parseFloat(estimatedIncomeBudgetCurrency) === null
                  ? 0.0
                  : parseFloat(estimatedIncomeBudgetCurrency),
              campaignEstimatedCostsBudgetsCurrency: parseFloat(
                estimatedCostsBudgetCurrency
              ),
              campaignNetProfitTargetBudgetsCurrency: parseFloat(
                netProfitTargetBudgetCurrency
              ),
              campaignEstimatedIncomeEur:
                parseFloat(estimatedIncome) === null
                  ? 0.0
                  : parseFloat(estimatedIncome),
              campaignEstimatedCostsEur: parseFloat(estimatedCosts),
              campaignNetProfitTargetEur: parseFloat(netProfitTarget),
              totalEstimatedCostsLC: parseFloat(totalEstimatedCostsLC),
              comments: comments,
              additionalInformation: comments,
              localCurrency: requestorsCompanyName.value.currency,

              projectType: "European One Vendor",
            },
          };
          var children: Submission[] = [];
          children.push({
            project: projectId,
            title: "",
            parentId: "",
            group: "vendor",
            created: new Date(),
            updated: new Date(),
            status: "New",
            author: requestorsName,
            data: {
              vendorName: vendorName.label,
              productionProjectManager: vendor.projectManager,
              creditorNumber: vendor.creditor,
              debitorNumber: vendor.debitor,
              manufacturerNumber: vendor.manufacturer,
              businessUnit: vendor.bu,
              PH1: vendor.ph.label,
              vendorBudgetCurrency:
                budgetSource.value === "noBudget"
                  ? "N/A"
                  : vendor.budgetCurrency.label,
              vendorAmount:
                isNaN(parseFloat(vendor.localBudget)) ||
                budgetSource.value === "noBudget"
                  ? 0.0
                  : parseFloat(vendor.localBudget),
              // cbbudgetEur: parseFloat(vendor.eurBudget),
              vendorShare: 100,
              estimatedCostsCC: parseFloat(estimatedCostsBudgetCurrency),
              estimatedIncomeCC:
                budgetSource.value === "noBudget"
                  ? 0.0
                  : parseFloat(estimatedIncomeBudgetCurrency),
              estimatedResultCC:
                parseFloat(netProfitTargetBudgetCurrency) *
                (budgetSource.value === "noBudget" ? -1 : 1),
              // cbestimatedCostsLC: parseFloat(vendor.estimatedCostsLC),
              estimatedIncomeEUR:
                budgetSource.value === "noBudget"
                  ? 0.0
                  : parseFloat(estimatedIncome),
              estimatedCostsEUR: parseFloat(estimatedCosts),
              estimatedResultEUR:
                parseFloat(netProfitTarget) *
                (budgetSource.value === "noBudget" ? -1 : 1),
              estimatedResultBC:
                parseFloat(netProfitTargetBudgetCurrency) *
                (budgetSource.value === "noBudget" ? -1 : 1),
              projectType: "European One Vendor",
              // cbnetProfitTargetLC: parseFloat(vendor.netProfitTargetLC),
            },
          });

          costBreakdown.forEach((company: any) => {
            children.push({
              project: projectId,
              title: "",
              parentId: "",
              group: "country",
              created: new Date(),
              updated: new Date(),
              status: "New",
              author: requestorsName,
              data: {
                projectName: campaignName,
                additionalInformation: comments,
                campaignChannel: campaignChannel.label,
                mirrorProjectNumber: projectNumber,
                projectNumber: company.projectNumber,
                campaignStartDate:
                  startDate === null ? null : startDate.toString(),
                campaignEndDate: endDate === null ? null : endDate.toString(),
                budgetSource: budgetSource.label,
                campaignCurrency: exchangeRates.label,
                vendorName: vendorName.label,
                businessUnit: vendor.bu,
                PH1: vendor.ph.label,
                vendorShare: 100,
                estimatedIncomeEUR:
                  budgetSource.value === "noBudget"
                    ? 0.0
                    : parseFloat(estimatedIncome),
                estimatedCostsEUR: parseFloat(estimatedCosts),
                estimatedResultEUR:
                  parseFloat(netProfitTarget) *
                  (budgetSource.value === "noBudget" ? -1 : 1),
                estimatedResultBC:
                  parseFloat(netProfitTargetBudgetCurrency) *
                  (budgetSource.value === "noBudget" ? -1 : 1),
                projectType: "European One Vendor",
                companyName: company.companyName,
                countryCodeEMEA: company.companyCode,
                country: company.country,
                countriesEMEA: company.country,
                productionProjectManager: company.contactEmail,
                countryShare: parseFloat(company.share),
                countryBudgetContributionEur: company.contribution,
                countryCostEstimationEur: company.estimatedCosts,
                countryBudgetContributionCC: isNaN(
                  parseFloat(company.contribution)
                )
                  ? 0.0
                  : parseFloat(company.contribution),
                countryCostEstimationCC: parseFloat(company.estimatedCosts),
              },
            });
          });
          var submission: SubmissionWithChildren = {
            submission: parent,
            children,
          };
          if (props.isDraft) {
            submission.submission.id = props.submission.id;
            RestAPI.updateDraft(submission).then((response) => {
              props.history.push("/");
            });
          } else {
            RestAPI.createDraft(submission).then((response) => {
              props.history.push("/");
            });
          }
        }}
      >
        Draft
      </Button>
      <Button
        float="right"
        mb={"80px"}
        mr="15px"
        color={"white"}
        bg={useColorModeValue("teal.400", "#4D97E2")}
        _hover={{
          bg: useColorModeValue("teal.300", "#377bbf"),
        }}
        isDisabled={
          !costBreakdown.some((company: any) => company.companyCode === "6110")
        }
        onClick={() => {
          var company = costBreakdown.find(
            (c: any) => c.companyCode === "6110"
          );
          if (company === undefined) {
            return;
          }
          var parent = {
            project: "6246bc93fa2a446faadb8d9a",
            title: "",
            parentId: null,
            group: "country",
            created: new Date(),
            updated: new Date(),
            status: "Incomplete",
            author: requestorsName,
            data: {
              status: "Incomplete",
              projectName: campaignName,
              additionalInformation: comments,
              campaignChannel: campaignChannel.label,
              mirrorProjectNumber: projectNumber,
              projectNumber: company.projectNumber,
              campaignStartDate:
                startDate === null ? null : startDate.toString(),
              campaignEndDate: endDate === null ? null : endDate.toString(),
              budgetSource: budgetSource.label,
              campaignCurrency: exchangeRates.label,
              vendorName: vendorName.label,
              businessUnit: vendor.bu,
              PH1: vendor.ph.label,
              vendorShare: 100,
              estimatedIncomeEUR:
                budgetSource.value === "noBudget"
                  ? 0.0
                  : parseFloat(estimatedIncome),
              estimatedCostsEUR: parseFloat(estimatedCosts),
              estimatedResultEUR:
                parseFloat(netProfitTarget) *
                (budgetSource.value === "noBudget" ? -1 : 1),
              estimatedResultBC:
                parseFloat(netProfitTargetBudgetCurrency) *
                (budgetSource.value === "noBudget" ? -1 : 1),
              projectType: "European One Vendor",
              companyName: company.companyName,
              countryCodeEMEA: company.companyCode,
              country: company.country,
              countriesEMEA: company.country,
              productionProjectManager: company.contactEmail,
              countryShare: parseFloat(company.share),
              countryBudgetContributionEur: company.contribution,
              countryCostEstimationEur: company.estimatedCosts,
              countryBudgetContributionCC: isNaN(
                parseFloat(company.contribution)
              )
                ? 0.0
                : parseFloat(company.contribution),
              countryCostEstimationCC: parseFloat(company.estimatedCosts),
            },
          };
          RestAPI.createSubmission(parent).then((response) => {
            props.history.push("/vendors");
          });
        }}
      >
        Local
      </Button>
    </Box>
  );
}
